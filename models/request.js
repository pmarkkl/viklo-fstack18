const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
  firstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  secondUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accepted: Boolean
})

requestSchema.static.format = (request) => {
  return {
    id: request.id,
    firstUser: request.firstUser,
    secondUser: request.secondUser,
    accepted: request.accepted
  }
}

const Request = mongoose.model('Request', requestSchema)
module.exports = Request