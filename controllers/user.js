const User = require('../models/user')
const Perfil = require('../models/perfil')
const bcrypt = require('bcryptjs')

exports.getCadastro = (req, res, next) => {
  res.render('../views/cadastro')
}

exports.postCadastro = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const nome = req.body.name

  const perfil = new Perfil({
    nome: nome
  })
  return perfil
    .save()
    .then(result => {
      User.findOne({ email: email })
        .then(user => {
          if (user) {
            // req.flash('error', 'Email already in use!')
            return res.redirect('login')
          }
          bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
              const newUser = new User({
                email: email,
                senha: hashedPassword,
                perfilPrincipal: result._id
              })
              newUser
                .save()
                .then(result => {
                  console.log('perfil salvo com sucesso!')
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
    .catch(err => {
      console.log(err)
    })
}

exports.getLogin = (req, res, next) => {
  res.render('../views/login', {
    // errorMessage: req.flash('error')
  })
}
