
const observationRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Observation = require('../models/observation')
const User = require('../models/user')
const Species = require('../models/species')
const validator = require('../validation')

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
  const body = req.body

  const errors = validator.validateObservationPost(body)

  if (errors.length > 0) {
    return res.status(400).json({ error: errors })
  }

  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: ['Ei tokenia tai se on virheellinen.'] })
    }
    
    if (!decodedToken.activated) {
      return res.status(401).json({ error: ['Tunnusta ei ole aktivoitu.'] })
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
      species,
      sex: body.sex,
      number: Number(body.number)
    })

    const savedObservation = await observation.save()

    user.observations = user.observations.concat(savedObservation._id)
    await user.save()

    species.observations = species.observations.concat(savedObservation._id)
    await species.save()

    res.json(Observation.format(savedObservation))

  } catch (exception) {
    if (exception.name = 'JsonWebTokenError') {
      res.status(401).json({ error: [exception.message] })
    } else {
      console.log(exception)
      res.status(500).json({ error: ['Jotain kummallista tapahtui'] })
    }
  }
})

observationRouter.post('/like', async (req, res) => {
  const body = req.body
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: ['Ei tokenia tai se on virheellinen.'] })
    }
    
    if (!decodedToken.activated) {
      return res.status(401).json({ error: ['Tunnusta ei ole aktivoitu.'] })
    }

    const existingObservation = await Observation.findById(body.observation)
    const existingUser = await User.findById(decodedToken.id)

    const hasBeenLiked = existingUser.likes.filter(like => String (like) === String (existingObservation._id))

    if (hasBeenLiked.length > 0) {
      return res.status(401).json({ error: ['Olet jo tykännyt havainnosta.'] })
    }

    const observationResponse = await Observation.findByIdAndUpdate(existingObservation._id, { likes: existingObservation.likes.concat(decodedToken.id) }, { new: true })

    console.log('observationResponse', observationResponse)

    const userResponse = await User.findByIdAndUpdate(decodedToken.id, { likes: existingUser.likes.concat(existingObservation._id) }, { new: true })

    res.json(User.format(userResponse))
  } catch (exception) {
    if (exception.name = 'JsonWebTokenError') {
      res.status(401).json({ error: [exception.message] })
    } else {
      console.log(exception)
      res.status(500).json({ error: ['Jotain kummallista tapahtui'] })
    }
  }
})

module.exports = observationRouter