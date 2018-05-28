const resetRouter = require('express').Router()
const User = require('../models/user')
const Reset = require('../models/reset')

resetRouter.post('/', async (req,res) => {
  const body = req.body
  try {
    const reset = await Reset.find({ randomBytes: body.id })
    if (reset.length < 1) {
      return res.status(404).send({ error: 'Koodi ei ole validi.' })
    }
    res.json(Reset.format(reset[0]))
  } catch (exc) {
    res.status(500).send({ error: 'jotain kummallista tapahtui' })
  }
})

module.exports = resetRouter