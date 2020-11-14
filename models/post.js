const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    perfil: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Perfil',
      required: true
    },
    tipo: {
      type: String
    },
    titulo: {
      type: String
    },
    conteudo: {
      type: String
    },
    path: {
      type: String
    },
    legenda: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
