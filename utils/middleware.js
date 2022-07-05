const { info } = require('./logger')
const jwt = require('jsonwebtoken')
const { SECRET, MODE } = require('./config')

const requestLogger = (request, response, next) => {
    if (!(MODE === 'test')){
        info('Method:', request.method)
        info('Path:  ', request.path)
        info('Body:  ', request.body)
        info('---')
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
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

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get('authorization')
    if (auth && auth.toLowerCase().includes('bearer ')) {
        request.token = auth.substring(7)
    } else request.token = null
    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, SECRET)
    if (!decodedToken.username) {
        return response.status(401).json({ error: 'invalid token' })
    }
    request.user = decodedToken.id
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}