const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const expressLayout = require('express-ejs-layouts')
const User = require('./models/user')
const multer = require('multer')

app.set('view engine', 'ejs')

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
})
mongoose.set('useFindAndModify', false)
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    })
})

app.use(flash())

app.use(expressLayout)

const userRoutes = require('./routes/user')
const dashboardRoutes = require('./routes/dashboard')

app.use(userRoutes)
app.use(dashboardRoutes)

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
