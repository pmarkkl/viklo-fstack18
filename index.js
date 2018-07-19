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
const tokenRouter = require('./controllers/tokens')
const resetRouter = require('./controllers/reset')

const bodyParser = require('body-parser')
require('dotenv').config()

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

app.use(express.static('build'))
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/observations', observationRouter)
app.use('/api/species', speciesRouter)
app.use('/api/requests', requestRouter)
app.use('/activate', tokenRouter)
app.use('/pwresetvalidity', resetRouter)

/* app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
}) */

const server = http.createServer(app)

server.listen(config.port || 5000, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}