const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    perfil: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Perfil',
      required: true
    },
    titulo: {
      type: String,
      required: true
    },
    conteudo: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
