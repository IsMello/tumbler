const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/', (req, res, next) => {
  res.render('../views/index')
})

router.get('/cadastro', (req, res, next) => {
  res.render('../views/cadastro')
})

router.get('/login', (req, res, next) => {
  res.render('../views/login')
})

router.post('/cadatro', userController.postCadastro)

module.exports = router
