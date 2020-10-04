const User = require('../models/user')
const Perfil = require('../models/perfil')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

exports.getCadastro = (req, res, next) => {
  res.render('cadastro', { errorMessage: null, oldInput: null })
}
exports.postCadastro = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const nome = req.body.name
  const errors = validationResult(req)
  let idPerfilPrincipal
  let newUser

  const perfil = new Perfil({
    nome: nome
  })
  if (!errors.isEmpty()) {
    return res.status(422).render('cadastro', {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        nome: nome,
        confirmPassword: confirmPassword
      }
    })
  }

  return Perfil.findOne({ nome: nome })
    .then(docPerfil => {
      if (docPerfil) {
        return res.status(422).render('cadastro', {
          errorMessage: 'Nome já em uso',
          oldInput: {
            email: email,
            password: password,
            nome: nome,
            confirmPassword: confirmPassword
          }
        })
      } else {
        return User.findOne({ email: email }).then(user => {
          if (user) {
            return res.status(422).render('cadastro', {
              errorMessage: 'Este email já está em uso!',
              oldInput: {
                email: email,
                password: password,
                nome: nome,
                confirmPassword: confirmPassword
              }
            })
          }
          return perfil
            .save()
            .then(result => {
              idPerfilPrincipal = result._id
              return idPerfilPrincipal
            })
            .then(result => {
              return bcrypt.hash(password, 12)
            })
            .then(hashedPassword => {
              newUser = new User({
                email: email,
                senha: hashedPassword,
                perfilPrincipal: idPerfilPrincipal
              })
              return newUser
            })
            .then(newUser => {
              return newUser.save()
            })
            .then(result => {
              res.redirect('/login')
            })
        })
      }
    })
    .catch(err => {
      console.log(err)
      return Perfil.findOne({ _id: idPerfilPrincipal })
        .then(perfil => {
          if (perfil) {
            return Perfil.findByIdAndDelete({ _id: idPerfilPrincipal })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
}

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('login', {
    errorMessage: null,
    oldInput: null,
    isLoggedIn: req.session.isLoggedIn
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)
  let perfil

  if (!errors.isEmpty()) {
    return res.status(422).render('login', {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      }
    })
  }

  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.render('login', {
          errorMessage: 'Email ou senha inválida',
          oldInput: { email: email, password: password }
        })
      }
      perfil = user.perfilPrincipal
      return user
    })
    .then(user => {
      return bcrypt.compare(password, user.senha)
    })
    .then(result => {
      if (result === false) {
        return res.render('login', {
          errorMessage: 'Email ou senha inválida',
          oldInput: { email: email, password: password }
        })
      }
      req.session.isLoggedIn = true
    })
    .then(result => {
      return Perfil.findById({ _id: perfil })
    })
    .then(perfil => {
      res.render('index', { isLoggedIn: req.session.isLoggedIn, perfil: perfil.nome })
    }).catch(err => {
      console.log(err)
    })
}
