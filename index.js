const http = require('http')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const observationRouter = require('./controllers/observations')
const speciesRouter = require('./controllers/species')
const bodyParser = require('body-parser')

mongoose.connect(config.mongoUrl)

app.use(bodyParser.json())

app.use('/api/users', usersRouter)
app.use('/api/observations', observationRouter)
app.use('/api/species', speciesRouter)

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