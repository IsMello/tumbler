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

app.set('view engine', 'ejs')

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
)
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
