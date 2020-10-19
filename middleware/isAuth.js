exports.isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/dashboard')
  }
  next()
}

exports.notAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/')
  }
  next()
}
