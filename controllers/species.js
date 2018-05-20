
const speciesRouter = require('express').Router()
const Species = require('../models/species')
const jwt = require('jsonwebtoken')

speciesRouter.get('/', async (req, res) => {
  const allSpecies = await Species
  .find({})
  .populate('observations', { latitude: 1, longitude: 1, date: 1 })
  res.json(allSpecies.map(Species.format))
})

speciesRouter.get('/:id', async (req, res) => {
  try {
    const species = await Species.findById(req.params.id)

    if (species) {
      res.json(Species.format(species))
    } else {
      res.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    res.status(400).json({ error: 'id päin helvettiä' })
  }
})

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

speciesRouter.post('/', async (req, res) => {
  const body = req.body
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'Ei tokenia tai se on virheellinen.' })
    }

    if (!decodedToken.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    if (body.finnishName === undefined || body.latinName == undefined ) {
      return res.status(400).json({ error: 'Ei sisältöä.' })
    }

    const maybeExists = await Species.find({ latinName: body.latinName })

    if (maybeExists.length > 0) {
      return res.status(400).json({ error: 'Laji on jo lisätty luetteloon' })
    }

    const species = new Species({
      finnishName: body.finnishName,
      latinName: body.latinName
    })

    const newSpecies = await species.save()
    res.json(Species.format(newSpecies))

  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'jotain kummaa tapahtui' })
  } 
})

module.exports = speciesRouter