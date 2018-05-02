const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req,res) => {
  const users = await User.find({})
  res.json(users.map(User.format))
})

usersRouter.post('/', async (req, res) => {
  try {

    const body = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

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