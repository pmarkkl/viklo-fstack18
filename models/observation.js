const mongoose = require('mongoose')

const observationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  date: String,
  additionalComments: String,
  town: String,
  zipcode: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  species: { type: mongoose.Schema.Types.ObjectId, ref: 'Species' }
})

observationSchema.statics.format = (observation) => {
  return {
    id: observation.id,
    latitude: observation.latitude,
    longitude: observation.longitude,
    date: observation.date,
    town: observation.town,
    zipcode: observation.zipcode,
    additionalComments: observation.additionalComments,
    species: {
      finnishName: observation.species.finnishName,
      latinName: observation.species.latinName
    },
    user: {
      id: observation.user._id,
      firstname: observation.user.firstname,
      lastname: observation.user.lastname
    }
  }
}

const Observation = mongoose.model('Observation', observationSchema)

module.exports = Observation