
const requestRouter = require('express').Router()
const Request = require('../models/request')

requestRouter.get('/', async (req,res) => {
  res.json({ error: 'morjes' })
})

module.exports = requestRouter