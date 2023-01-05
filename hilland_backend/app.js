const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser({limit: '2mb'}))
const newsRouter = require('./controllers/news')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
const path = require('path')
//app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))
//app.use('/api/testpicture', express.static(__dirname + 'public'))
//app.use(middleware.userExtractor)
app.use('/api/login', loginRouter)
app.use('/api/news', middleware.userExtractor, newsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app