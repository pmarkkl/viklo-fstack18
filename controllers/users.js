const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req,res) => {
  const users = await User
  .find({})
  .populate('observations', { latitude: 1, longitude: 1, additionalComments: 1, species: 1 })
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
    res.status(400).json({ error: 'id väärin' })
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
      address: body.address,
      zipcode: body.zipcode,
      town: body.town,
      phone: body.phone,
      passwordHash
    })

    const savedUser = await user.save()
    res.json(User.format(savedUser))
  } catch (exc) {
    console.log(exc)
    res.status(500).json({ error: 'jotain kummaa tapahtui' })
  }
})

module.exports = usersRouter