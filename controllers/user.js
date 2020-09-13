exports.getCadastro = (req, res, next) => {
  res.render('../views/cadastro')
}

exports.postCadastro = (req, res, next) => {
  const email = req.body.email
  console.log(email)
}
