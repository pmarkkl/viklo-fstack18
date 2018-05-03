
const requestRouter = require('express').Router()
const Request = require('../models/request')
const User = require('../models/user')

requestRouter.get('/', async (req,res) => {
  const requests = await Request.find({})
  res.json(requests.map(Request.format))
})

requestRouter.post('/', async (req, res) => {
  const body = req.body
  try {
    const firstUser = await User.findById(body.sent)
    const secondUser = await User.findById(body.received)
    
    if (!(firstUser || secondUser)) {
      return res.status(400).json({ error: 'Käyttäjiä ei löydy' })
    }
    
    const request = new Request({
      sent: firstUser._id,
      received: secondUser._id
    })
  
    const savedRequest = await request.save()

    res.json(Request.format(savedRequest))

  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'Jotain kummallista tapahtui' })
  }

})

module.exports = requestRouter