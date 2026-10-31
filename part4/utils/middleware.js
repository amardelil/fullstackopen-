const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path)
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) return response.status(401).json({ error: 'token missing' })
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) return response.status(401).json({ error: 'token invalid' })
    request.user = await User.findById(decodedToken.id)
    if (!request.user) return response.status(401).json({ error: 'user not found' })
    next()
  } catch (error) {
    next(error)
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') return response.status(400).json({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  if (error.name === 'JsonWebTokenError') return response.status(401).json({ error: 'token invalid' })
  if (error.name === 'TokenExpiredError') return response.status(401).json({ error: 'token expired' })
  next(error)
}

module.exports = { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
