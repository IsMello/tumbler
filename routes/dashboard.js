const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard')
const { check } = require('express-validator/check')

router.get('/', dashboardController.getIndex)

router.get('/post', dashboardController.getPost)

router.post(
  '/post',
  check('titulo')
    .notEmpty()
    .withMessage('Por favor insira o título do post'),
  dashboardController.postPost
)

router.post('/follow', dashboardController.postFollow)

router.post('/unfollow', dashboardController.postUnfollow)

module.exports = router
