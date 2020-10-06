const Perfil = require('../models/perfil')
const Post = require('../models/post')
const { validationResult } = require('express-validator/check')

exports.getIndex = (req, res, next) => {
  if (!req.session.perfil) {
    return res.render('index', { path: '/', perfil: null })
  }
  return Perfil.findById({ _id: req.session.perfil })
    .then(result => {
      res.render('index', { path: '/', perfil: result.nome })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getPost = (req, res, next) => {
  res.render('post', { path: '/post', errorMessage: null })
}

exports.postPost = (req, res, next) => {
  const perfil = req.session.perfil
  const titulo = req.body.titulo
  const conteudo = req.body.conteudo
  const errors = validationResult(req)
  const post = new Post({
    perfil: perfil,
    titulo: titulo,
    conteudo: conteudo
  })

  if (!errors.isEmpty()) {
    return res.status(422).render('post', {
      path: '/post',
      errorMessage: errors.array()[0].msg
    })
  }

  return post
    .save()
    .then(result => {
      return res.redirect('/')
    })
    .catch(err => {
      console.log(err)
    })
}
