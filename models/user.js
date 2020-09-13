const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  perfilPrincipal: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Perfil',
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)
