const Perfil = require('../models/perfil')
const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } = require('express-validator/check')
let perfilAtual
let dashPosts

exports.getIndex = (req, res, next) => {
  return Post.find({})
    .limit(10)
    .sort({ createdAt: -1 })
    .populate('perfil')
    .then(posts => {
      dashPosts = posts
      return res.render('index', {
        path: '/',
        posts: dashPosts
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getDashboard = (req, res, next) => {
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
      // var teste = posts.map(function (post) {
      //   if (req.user.perfisSeguidos.includes(post.perfil._id) === true) {
      //     return (post.follow = 'unfollow')
      //   } else if (
      //     req.user.perfilPrincipal.toString() === post.perfil._id.toString()
      //   ) {
      //     return (post.follow = 'self')
      //   } else {
      //     return (post.follow = 'follow')
      //   }
      // })
      dashPosts = posts
      res.render('dashboard', {
        path: '/dashboard',
        perfil: perfilAtual,
        posts: dashPosts,
        user: req.user,
        errorMessage: null
        // teste: teste
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
      return res.redirect('/dashboard')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postFollow = (req, res, next) => {
  if (req.user.perfilPrincipal.toString() === req.body.perfilId.toString()) {
    return res.render('dashboard', {
      path: '/dashboard',
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
    res.redirect('/dashboard')
  })
}

exports.postUnfollow = (req, res, next) => {
  return User.findOneAndUpdate(
    { _id: req.session.user._id },
    { $pull: { perfisSeguidos: req.body.perfilId } }
  ).then(result => {
    res.redirect('/dashboard')
  })
}

exports.getSugeridos = (req, res, next) => {
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
      res.render('sugeridos', {
        path: '/sugeridos',
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
