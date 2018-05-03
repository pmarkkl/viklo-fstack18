
const observationRouter = require('express').Router()
const Observation = require('../models/observation')
const User = require('../models/user')
const Species = require('../models/species')

observationRouter.get('/', async (req, res) => {
  const observations = await Observation
  .find({})
  .populate('user', { firstname: 1, lastname: 1 })
  .populate('species', { finnishName: 1, latinName: 1 })

  res.json(observations.map(Observation.format))
})

observationRouter.post('/', async (req,res) => {
  try {

    const body = req.body
    const user = await User.findById(body.userId)
    const species = await Species.findById(body.speciesId)

    const observation = new Observation({
      latitude: body.latitude,
      longitude: body.longitude,
      date: body.date,
      additionalComments: body.additionalComments,
      user: user._id,
      species: species._id
    })

    const savedObservation = await observation.save()

    user.observations = user.observations.concat(savedObservation._id)
    await user.save()

    species.observations = species.observations.concat(savedObservation._id)
    await species.save()

    res.json(Observation.format(savedObservation))

  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'jotain kummaa tapahtui' })
  }
})

module.exports = observationRouter