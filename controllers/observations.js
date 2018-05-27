
const observationRouter = require('express').Router()
const jwt = require('jsonwebtoken')
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

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

observationRouter.post('/', async (req,res) => {
  console.log(req.body)
  const body = req.body
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    console.log(decodedToken)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'Ei tokenia tai se on virheellinen.' })
    }
    
    if (!decodedToken.activated) {
      return res.status(401).json({ error: 'Tunnusta ei ole aktivoitu.' })
    }
    
    if (body.speciesId === undefined) {
      return res.status(400).json({ error: 'Ei sisältöä.' })
    }

    const user = await User.findById(decodedToken.id)
    const species = await Species.findById(body.speciesId)

    const date = new Date(body.date)

    const observation = new Observation({
      latitude: body.latitude,
      longitude: body.longitude,
      zipcode: body.zipcode,
      town: body.town,
      date,
      additionalComments: body.additionalComments,
      user,
      species
    })

    const savedObservation = await observation.save()

    user.observations = user.observations.concat(savedObservation._id)
    await user.save()

    species.observations = species.observations.concat(savedObservation._id)
    await species.save()

    res.json(Observation.format(savedObservation))

  } catch (exception) {
    if (exception.name = 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(500).json({ error: 'Jotain kummallista tapahtui' })
    }
  }
})

module.exports = observationRouter