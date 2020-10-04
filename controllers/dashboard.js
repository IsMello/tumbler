const Perfil = require('../models/perfil')

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
