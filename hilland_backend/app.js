const config = require('./utils/config')
var path = require('path')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const newsRouter = require('./controllers/news')
const usersRouter = require('./controllers/users')
const songrequestsRouter = require('./controllers/songrequests')
const loginRouter = require('./controllers/login')
const archivesRouter = require('./controllers/archives')
const releasesRouter = require('./controllers/releases')
const mediaRouter = require('./controllers/media')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery', false)
mongoose 
  .connect(config.MONGODB_URI)
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
app.use('/api/login', loginRouter)
app.use('/api/news', middleware.userExtractor, newsRouter)
app.use('/api/releases', releasesRouter)
app.use('/api/users', usersRouter)
app.use('/api/archives', archivesRouter)
app.use('/api/songrequests', songrequestsRouter)
app.use('/api/media', mediaRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
