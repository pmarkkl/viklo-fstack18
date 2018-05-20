const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Request = require('../models/request')
const jwt = require('jsonwebtoken')

usersRouter.get('/', async (req,res) => {
  const users = await User
  .find({})
  .populate('observations', { date: 1, latitude: 1, longitude: 1, additionalComments: 1, species: 1 })
  res.json(users.map(User.format))
})

usersRouter.get('/:id', async (req,res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.json(User.format(user))
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    res.status(404).json({ error: 'id päin helvettiä' })
  }
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const maybeExists = await User.find({ email: body.email })

    if (maybeExists.length > 0) {
      return res.status(400).json({ error: 'Sähköposti on jo rekisteröity' })
    }

    const user = new User({
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      passwordHash
    })

    const savedUser = await user.save()
    res.json(User.format(savedUser))
  } catch (exc) {
    console.log(exc)
    res.status(500).json({ error: 'jotain kummaa tapahtui' })
  }
})

usersRouter.post('/accept', async (req, res) => {
  const body = req.body
  try {
    const sent = await User.findById(body.sent)
    const received = await User.findById(body.received)

    const updatedRequest = await Request.findByIdAndUpdate(body.id, { accepted: true })

    if (sent === undefined || received === undefined || updatedRequest === undefined) {
      return res.status(404).end()
    }

    sent.friends = sent.friends.concat(received._id)
    received.friends = received.friends.concat(sent._id)

    await sent.save()
    await received.save()

    res.json(Request.format(updatedRequest))

  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'accepting kusee' })
  }
})

usersRouter.post('/removeallfriends', async (req, res) => {
  const users = await User.find({})
  users.map(user => {
    user.friends = []
    user.save()
  })
  res.json({ error: 'KAIKKI POISTETTU!' })
})

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

usersRouter.post('/makeadmin', async (req, res) => {
  const body = req.body
  console.log(body.userId)
  
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token) {
    return res.status(401).json({ error: 'Ei tokenia' })
  }

  const checkAdminStatus = await User.findById(decodedToken.id)

  if (!checkAdminStatus.admin) {
    return res.status(401).json({ error: 'Et omista admin-oikeuksia' })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(body.userId, { admin: true })
    res.json(updatedUser)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'Jotain kummallista tapahtui admin-oikeuksien muuttamisessa' })
  }
})


module.exports = usersRouter