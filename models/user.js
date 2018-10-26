const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  address: { type: String, default: '' },
  zipcode: { type: String, default: '' },
  town: { type: String, default: '' },
  phone: { type: String, default: '' },
  passwordHash: String,
  admin: { type: Boolean, default: false },
  activated: { type: Boolean, default: true },
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
    zipcode: user.zipcode,
    town: user.town,
    phone: user.phone,
    observations: user.observations,
    friends: user.friends,
    requests: user.requests,
    activated: user.activated,
    likes: user.likes
  }
}

userSchema.statics.publicFormat = (user) => {
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    town: user.town,
    observations: user.observations,
    friends: user.friends,
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User