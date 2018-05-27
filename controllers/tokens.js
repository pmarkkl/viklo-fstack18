const tokenRouter = require('express').Router()
const Token = require('../models/token')
const crypto = require('crypto')
const User = require('../models/user')
const nodemailer = require('nodemailer')

tokenRouter.get('/', async (req, res) => {
  const tokens = await Token.find({}).populate('user')
  res.json(tokens.map(Token.format))
})


// activation
tokenRouter.post('/', async (req, res) => {
  const id = req.body.token
  try {
    const token = await Token.findOne({ token: id })
    if (!token) {
      return res.status(401).send({ error: 'Aktivointitunnus on virheellinen.' })
    }

    const user = await User.findById(token.user)

    if (user.activated) {
      return res.status(403).send({ error: 'Käyttäjätunnus on jo aktivoitu.' })
    }

    const response = await User.findByIdAndUpdate(token.user, { activated: true })
    res.json(User.format(response))
  } catch (exc) {
    console.log(exc)
    res.status(400).send({ error: 'ID ei ole kelvollinen.' })
  }
})


tokenRouter.post('/resend', async (req, res) => {  
  console.log('tokenRouter post resend')

  const activationToken = new Token({
    user: req.body.id,
    token: crypto.randomBytes(16).toString('hex')
  })
  const savedToken = await activationToken.save()

  const user = await User.findById(req.body.id)

  const transporter = nodemailer.createTransport('smtps://vikloemail%40gmail.com:Perkeles6!@smtp.gmail.com')
  const mailOptions = {
    from: '"Viklo"',
    to: user.email,
    subject: 'Viklo-tunnuksen aktivointi',
    html: `<h1>Hei, ${user.firstname}</h1> <p>Aktivoi tunnuksesi klikkamalla: <a href="http://localhost:3000/activation/${activationToken.token}">http://localhost:3000/activation/${activationToken.token}</p>`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('email sent', info.response)
    }
  })
  
  res.json(Token.format(savedToken))
})

tokenRouter.post('/:id', async (req, res) => {
  const id = req.params.id
  console.log('req params id', id)
  const token = await Token.findOne({ token: id })

  const response = await User.findByIdAndUpdate(token.user, { activated: true })

  console.log(response)

  res.json(Token.format(token))
})

module.exports = tokenRouter