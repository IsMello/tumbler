const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/', (req, res, next) => {
  res.render('../views/index')
})

router.get('/cadastro', userController.getCadastro)

router.post('/cadastro', userController.postCadastro)

router.get('/login', userController.getLogin)

module.exports = router
