const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')))
const userRoutes = require('./routes/user')

app.use(userRoutes)

app.listen(3000)
