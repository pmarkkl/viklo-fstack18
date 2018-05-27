// activation token

const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  createdAt: { type: Date, default: Date.now(), expires: 14400 }
})

tokenSchema.statics.format = (token) => {
  return {
    id: token._id,
    user: token.user,
    token: token.token,
    createdAt: token.createdAt
  }
}

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token