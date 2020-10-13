const Perfil = require('../models/perfil')
const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } = require('express-validator/check')
let perfilAtual
let dashPosts

exports.getIndex = (req, res, next) => {
  // let perfilAtual
  if (!req.session.perfil) {
    return res.render('index', {
      path: '/',
      perfil: null,
      posts: null,
      user: null,
      errorMessage: null
    })
  }
  return Perfil.findById({ _id: req.session.perfil })
    .then(perfil => {
      perfilAtual = perfil.nome
      return perfilAtual
    })
    .then(result => {
      return Post.find({})
        .limit(10)
        .sort({ createdAt: -1 })
        .populate('perfil')
    })
    .then(posts => {
      dashPosts = posts
      res.render('index', {
        path: '/',
        perfil: perfilAtual,
        posts: dashPosts,
        user: req.user,
        errorMessage: null
      })
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

exports.postFollow = (req, res, next) => {
  if (req.user.perfilPrincipal.toString() === req.body.perfilId.toString()) {
    return res.render('index', {
      path: '/',
      perfil: perfilAtual,
      posts: dashPosts,
      user: req.user,
      errorMessage: 'Você não pode seguir o próprio perfil!'
    })
  }
  return User.findOneAndUpdate(
    { _id: req.session.user._id },
    { $addToSet: { perfisSeguidos: req.body.perfilId } }
  ).then(result => {
    res.redirect('/')
  })
}

exports.postUnfollow = (req, res, next) => {
  return User.findOneAndUpdate(
    { _id: req.session.user._id },
    { $pull: { perfisSeguidos: req.body.perfilId } }
  ).then(result => {
    res.redirect('/')
  })
}
