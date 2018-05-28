const mongoose = require('mongoose')

const resetSchema = new mongoose.Schema({
  randomBytes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now(), expires: 3600 }
})

resetSchema.statics.format = (reset) => {
  console.log('juu vittu')
  console.log('reset: ', reset)
  return {
    user: reset.user,
    randomBytes: reset.randomBytes
  }
}

const Reset = mongoose.model('Reset', resetSchema)

module.exports = Reset