const User = require('../models/user')
const Perfil = require('../models/perfil')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

exports.getCadastro = (req, res, next) => {
  res.render('../views/cadastro', { errorMessage: null, oldInput: null })
}

exports.postCadastro = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const nome = req.body.name
  const errors = validationResult(req)
  const perfil = new Perfil({
    nome: nome
  })
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('../views/cadastro', {
        errorMessage: errors.array()[0].msg,
        oldInput: { email: email, password: password, nome: nome, confirmPassword: confirmPassword }
      })
  }

  return Perfil.findOne({ nome: nome })
    .then(docPerfil => {
      if (docPerfil) {
        req.flash('error', 'Nome já em uso')
        return res.redirect('login')
      } else {
        return User.findOne({ email: email }).then(user => {
          if (user) {
            req.flash('error', 'Este email já está em uso!')
            return res.redirect('login')
          }
          return perfil
            .save()
            .then(result => {
              bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                  const newUser = new User({
                    email: email,
                    senha: hashedPassword,
                    perfilPrincipal: result._id
                  })
                  return newUser
                    .save()
                    .then(result => {
                      res.redirect('/login')
                    })
                    .catch(err => {
                      console.log(err)
                    })
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getLogin = (req, res, next) => {
  res.render('../views/login', {
    errorMessage: req.flash('error')
  })
}
