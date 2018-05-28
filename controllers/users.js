const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Request = require('../models/request')
const jwt = require('jsonwebtoken')
const validator = require('../validation')
const crypto = require('crypto')
const Token = require('../models/token')
const nodemailer = require('nodemailer')

usersRouter.get('/', async (req,res) => {
  const users = await User
  .find({})
  .populate('observations')
  .populate('requests', { accepted: 1, sent: 1, received: 1 })
  res.json(users.map(User.format))
})

usersRouter.get('/:id', async (req,res) => {
  try {
    const user = await User.findById(req.params.id).populate('observations')
    if (user) {
      res.json(User.format(user))
    } else {
      res.status(404).end()
    }
  } catch (exc) {
    console.log(exc)
    res.status(500).json({ error: 'jotain kummallista tapahtui' })
  }
})

const passwordHasher = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PW
  }
})


usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const errors = validator.validateRegForm(body)
    console.log(errors)

    if (errors.length > 0) {
      return res.status(422).json({ error: errors })
    }

    const maybeExists = await User.find({ email: body.email })

    if (maybeExists.length > 0) {
      return res.status(400).json({ error: ['Sähköposti on jo rekisteröity'] })
    }

    const passwordHash = await passwordHasher(body.password)

    const user = new User({
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      passwordHash
    })

    const savedUser = await user.save()

    const activationToken = new Token({
      user: savedUser.id,
      token: crypto.randomBytes(16).toString('hex')
    })

    await activationToken.save()

    const mailOptions = {
      from: '"Viklo"',
      to: body.email,
      subject: 'Viklo-tunnuksen aktivointi',
      html: `<h1>Hei, ${savedUser.firstname}</h1> <p>Aktivoi tunnuksesi klikkamalla: <a href="http://localhost:3000/activation/${activationToken.token}">http://localhost:3000/activation/${activationToken.token}</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('email sent', info.response)
      }
    })

    res.json(User.format(savedUser))
  } catch (exc) {
    console.log(exc)
    res.status(500).json([{ error: 'jotain kummaa tapahtui' }])
  }
})

usersRouter.put('/resetpassword', async (req, res) => {
  const body = req.body
  try {
    const newPassword = crypto.randomBytes(6).toString('hex')
    const email = body.email
    const mikaHelvetinListaSieltaPalautuu = await User.find({ email: body.email })

    if (mikaHelvetinListaSieltaPalautuu.length < 1) {
      return res.status(401).send({ error: 'Käyttäjää ei löydy' })
    }

    console.log('jaaha jahaaa', mikaHelvetinListaSieltaPalautuu[0]._id)

    const passwordHash = await passwordHasher(newPassword)
    const user = mikaHelvetinListaSieltaPalautuu[0]
    const savedUser = await User.findByIdAndUpdate(user._id, { passwordHash }, { new: true })
    const mailOptions = {
      from: 'Viklo',
      to: body.email,
      subject: '(Viklo) Salasanan resetointi',
      html: `<h1>Salasanan resetointi</h1><p>Olet pyytänyt salasanan resetointia tunnuksellesi ${body.email}</p><p>Uusi salasana on ${newPassword}</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('email sent', info.response)
      }
      res.json(User.format(response))
    })
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