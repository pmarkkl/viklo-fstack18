const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  address: String,
  zipcode: String,
  town: String,
  phone: String,
  passwordHash: String,
  admin: { type: Boolean, default: false },
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
    zipcode: user.zipcode,
    town: user.town,
    phone: user.phone,
    admin: user.admin,
    observations: user.observations,
    friends: user.friends
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
