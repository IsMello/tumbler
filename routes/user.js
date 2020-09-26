const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { check } = require('express-validator/check')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/cadastro', userController.getCadastro)

router.post(
  '/cadastro',
  check('email', 'Insira um email válido!')
    .isEmail(),
  check(
    'password',
    'A senha deve ter no mínimo 8 caracteres com letras e números, insira uma senha válida'
  )
    .isLength({ min: 8 })
    .isAlphanumeric()
  ,
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Senhas devem ser iguais')
    }
    return true
  }),
  userController.postCadastro
)

router.get('/login', userController.getLogin)

module.exports = router
