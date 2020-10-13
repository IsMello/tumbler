const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  perfilPrincipal: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Perfil',
    required: true
  },
  perfisSeguidos: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Perfil'
  }
})

module.exports = mongoose.model('User', userSchema)
