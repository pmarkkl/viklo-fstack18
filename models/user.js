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
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }]
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
    phone: user.phone
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
