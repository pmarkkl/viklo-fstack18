
const requestRouter = require('express').Router()
const Request = require('../models/request')
const User = require('../models/user')

requestRouter.get('/', async (req,res) => {
  const requests = await Request.find({})
  res.json(requests.map(Request.format))
})

requestRouter.get('/user/:id', async (req, res) => {
  const response = await Request.find({ 
    $or: [
      { sent: req.params.id },
      { received: req.params.id }
    ]
   })
  res.json(response.filter(response => !response.accepted).map(Request.format))
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

    firstUser.requests = firstUser.requests.concat(savedRequest._id)
    secondUser.requests = secondUser.requests.concat(savedRequest._id)
    await firstUser.save()
    await secondUser.save()

    res.json(Request.format(savedRequest))

  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'Jotain kummallista tapahtui' })
  }

})

module.exports = requestRouter