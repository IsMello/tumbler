const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard')
const { check } = require('express-validator/check')
const auth = require('../middleware/isAuth')

router.get('/', auth.isAuth, dashboardController.getIndex)

router.get('/dashboard', auth.notAuth, dashboardController.getDashboard)

router.get('/post', auth.notAuth, dashboardController.getPost)

router.post(
  '/post',
  check('titulo')
    .notEmpty()
    .withMessage('Por favor insira o título do post'),
  dashboardController.postPost
)

router.post('/follow', dashboardController.postFollow)

router.post('/unfollow', dashboardController.postUnfollow)

router.get('/sugeridos', auth.notAuth, dashboardController.getSugeridos)

router.get('/image', auth.notAuth, dashboardController.getImagePost)

router.post('/image', auth.notAuth, dashboardController.postImagePost)

module.exports = router
