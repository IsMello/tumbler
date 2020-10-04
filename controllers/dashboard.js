exports.getIndex = (req, res, next) => {
  res.render('index', { isLoggedIn: req.session.isLoggedIn, perfil: null })
}
