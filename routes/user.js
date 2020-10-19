const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { check } = require('express-validator/check')
const auth = require('../middleware/isAuth')

router.get('/cadastro', auth.isAuth, userController.getCadastro)

router.post(
  '/cadastro',
  check('name')
    .notEmpty()
    .withMessage('Por favor preencha o Nome do seu perfil'),
  check('email', 'Insira um email válido!').isEmail(),
  check(
    'password',
    'A senha deve ter no mínimo 8 caracteres com letras e números, insira uma senha válida'
  )
    .not()
    .isAlpha()
    .not()
    .isNumeric()
    .isLength({ min: 8 })
    .isAlphanumeric(),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Senhas devem ser iguais')
    }
    return true
  }),
  userController.postCadastro
)

router.get('/login', auth.isAuth, userController.getLogin)

router.post(
  '/login',
  check('email')
    .isEmail()
    .withMessage('Por favor insira um email válido'),
  check('password')
    .notEmpty()
    .withMessage('Por favor insira a senha'),
  userController.postLogin
)

router.get('/logout', auth.notAuth, userController.getLogout)

module.exports = router
