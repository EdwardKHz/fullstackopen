const logger = require('./logger')
const User = require('../models/User')
const jwt = require("jsonwebtoken")

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
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error)
}

const userExtractor = async (request, response, next) => {
    try {
        const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer ')) {
            const token = authorization.replace('Bearer ', '')
            const decodedToken = jwt.verify(token, process.env.SECRET)

            if (!decodedToken.id) {
                return response.status(401).json({ error: 'token invalid' })
            }


            const user = await User.findById(decodedToken.id)
            if (!user) {
                return response.status(401).json({ error: 'user not found' })
            }

            request.user = user
        } else {
            request.user = null
        }

        next()
    } catch (error) {
        next(error)
    }
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor
}