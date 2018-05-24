const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  
  const user = await User.findOne({ email: body.email })

  const passwordCheck = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCheck)) {
    return res.status(401).send({ error: 'Tunnus tai salasana väärin.' })
  }

  const userForToken = {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    admin: user.admin,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  console.log(user)

  res.status(200).send({ 
    token, id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, admin: user.admin
  })
})

module.exports = loginRouter