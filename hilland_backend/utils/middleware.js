const logger = require('./logger')
const jwt = require('jsonwebtoken')
//const { get, post } = require('superagent')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })

  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  logger.error(error.message)
  next(error)
}
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
 
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const adminCredentialsValidator = (request, response, next) => {
  const token = request.token
  const user = jwt.verify(token, process.env.SECRET)
  if (user.role !== 'admin') {
    return response
      .status(401)
      .json({ error: 'you don´t have rights for this operation' })
  }
  next()
}

const userLoggedInValidator = (request, response, next) => {
  const token = request.token
  const user = jwt.verify(token, process.env.SECRET)
  if (!token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  next()
}

const userExtractor = (request, response, next) => {
  if (request.method === 'POST' || request.method === 'DELETE') {
    try {
      const tokenDecoded = jwt.verify(request.token, process.env.SECRET)
      request.user = {
        username: tokenDecoded.username,
        role: tokenDecoded.role,
        id: tokenDecoded.id,
      }
    } catch (error) {
      // Handle token verification error, e.g., token is invalid or expired
      return response.status(401).json({ error: 'Authentication failed' })
    }
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  adminCredentialsValidator,
  userLoggedInValidator,
  userExtractor

}