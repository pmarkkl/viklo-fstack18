const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
  sent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  received: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accepted: { type: Boolean, default: false }
})

requestSchema.statics.format = (request) => {
  return {
    id: request.id,
    sent: request.sent,
    received: request.received,
    accepted: request.accepted
  }
}

const Request = mongoose.model('Request', requestSchema)

module.exports = Request