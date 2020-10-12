const Perfil = require('../models/perfil')
const Post = require('../models/post')
const { validationResult } = require('express-validator/check')

exports.getIndex = (req, res, next) => {
  let user
  if (!req.session.perfil) {
    return res.render('index', { path: '/', perfil: null, posts: null })
  }
  return Perfil.findById({ _id: req.session.perfil })
    .then(result => {
      user = result.nome
      return user
    })
    .then(result => {
      return Post.find({})
        .limit(10)
        .sort({ createdAt: -1 }).populate('perfil')
    })
    .then(result => {
      res.render('index', { path: '/', perfil: user, posts: result })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getPost = (req, res, next) => {
  res.render('post', { path: '/post', errorMessage: null, oldInput: null })
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
      errorMessage: errors.array()[0].msg,
      oldInput: { titulo: titulo, conteudo: conteudo }
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
