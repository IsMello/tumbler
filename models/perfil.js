const mongoose = require('mongoose')
const Schema = mongoose.Schema

const perfilSchema = new Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Perfil', perfilSchema)
