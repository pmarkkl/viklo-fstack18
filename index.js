const http = require('http')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const cors = require('cors')

const usersRouter = require('./controllers/users')
const observationRouter = require('./controllers/observations')
const speciesRouter = require('./controllers/species')
const loginRouter = require('./controllers/login')
const requestRouter = require('./controllers/requests')

const bodyParser = require('body-parser')

mongoose.connect(config.mongoUrl)

const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(logger)

app.use(bodyParser.json())
app.use(cors())

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/observations', observationRouter)
app.use('/api/species', speciesRouter)
app.use('/api/requests', requestRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}