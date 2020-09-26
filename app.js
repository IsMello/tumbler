const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({ secret: process.env.MY_SECRET, resave: false, saveUninitialized: false })
)
app.use(flash())

const userRoutes = require('./routes/user')

app.use(userRoutes)

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
