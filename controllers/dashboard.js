const Perfil = require('../models/perfil')
const Post = require('../models/post')
const User = require('../models/user')
const { validationResult } = require('express-validator/check')
let perfilAtual
let dashPosts
const ITEMS_PER_PAGE = 4

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1
  let totalPosts

  Post.find()
    .countDocuments()
    .then(numPosts => {
      totalPosts = numPosts
      return Post.find({})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 })
        .populate('perfil')
    })
    .then(posts => {
      dashPosts = posts
      return res.render('index', {
        path: '/',
        posts: dashPosts,
        totalPosts: totalPosts,
        hasNextPage: ITEMS_PER_PAGE * page < totalPosts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPosts / ITEMS_PER_PAGE),
        currentPage: page
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getDashboard = (req, res, next) => {
  const page = +req.query.page || 1
  let totalPosts
  return Perfil.findById({ _id: req.session.perfil })
    .then(perfil => {
      perfilAtual = perfil.nome
      return perfilAtual
    })
    .then(result => {
      return Post.find().countDocuments()
    })
    .then(numPosts => {
      totalPosts = numPosts
      return Post.find({})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 })
        .populate('perfil')
    })
    .then(posts => {
      const dashPosts = posts.map(function (post) {
        const novoPost = { ...post._doc }
        const user = req.user
        const perfilId = post.perfil._id
        if (user.perfisSeguidos.includes(perfilId)) {
          novoPost.follow = 'unfollow'
        } else if (user.perfilPrincipal.toString() === perfilId.toString()) {
          novoPost.follow = 'self'
        } else {
          novoPost.follow = 'follow'
        }
        return novoPost
      })
      res.render('dashboard', {
        path: '/dashboard',
        perfil: perfilAtual,
        posts: dashPosts,
        user: req.user,
        errorMessage: null,
        totalPosts: totalPosts,
        hasNextPage: ITEMS_PER_PAGE * page < totalPosts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPosts / ITEMS_PER_PAGE),
        currentPage: page
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
    conteudo: conteudo,
    tipo: 'text'
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
  const page = +req.query.page || 1
  let totalPosts
  return Perfil.findById({ _id: req.session.perfil })
    .then(perfil => {
      perfilAtual = perfil.nome
      return perfilAtual
    })
    .then(result => {
      return Post.find().countDocuments()
    })
    .then(numPosts => {
      totalPosts = numPosts
      return Post.find({})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
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
        errorMessage: null,
        totalPosts: totalPosts,
        hasNextPage: ITEMS_PER_PAGE * page < totalPosts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPosts / ITEMS_PER_PAGE),
        currentPage: page
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getImagePost = (req, res, next) => {
  return res.render('photo', { path: 'image', errorMessage: null })
}

exports.postImagePost = (req, res, next) => {
  const image = req.file
  const legenda = req.body.legenda
  const perfil = req.session.perfil

  if (!image) {
    return res.status(422).render('photo', {
      path: 'image',
      errorMessage: 'O arquivo anexado não é uma imagem!'
    })
  }
  const post = new Post({
    perfil: perfil,
    tipo: 'image',
    path: image.path,
    legenda: legenda
  })
  return post
    .save()
    .then(result => {
      res.redirect('/dashboard')
    })
    .catch(err => {
      console.log(err)
    })
}

// exports.getEditImagePost = (req, res, next) => {
//  const image = req.file
//  if(image)  {
//   const imageMedia = new Media({
//     fileName: image.filename,
//     path: image.path
//   })
// }
//   return res.render('photo', { path: 'image', errorMessage: null })
// }
