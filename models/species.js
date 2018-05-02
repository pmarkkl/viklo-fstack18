const mongoose = require('mongoose')

const speciesSchema = new mongoose.Schema({
  finnishName: String,
  latinName: String,
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }]
})

speciesSchema.statics.format = (species) => {
  return {
    id: species.id,
    finnishName: species.finnishName,
    latinName: species.latinName
  }
}

const Species = mongoose.model('Species', speciesSchema)

module.exports = Species