const mongoose = require('mongoose')

const observationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  date: Date,
  additionalComments: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  species: { type: mongoose.Schema.Types.ObjectId, ref: 'Species' }
})

observationSchema.statics.format = (observation) => {
  return {
    id: observation.id,
    latitude: observation.latitude,
    longitude: observation.longitude,
    date: observation.date,
    additionalComments: observation.additionalComments,    
  }
}

const observation = mongoose.model('Observation', observationSchema)

module.exports = Observation