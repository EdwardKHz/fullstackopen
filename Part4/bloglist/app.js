const express = require('express')
const mongoose = require('mongoose')
const {MONGODB_URI} = require("./utils/config")
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const cors = require("cors")

const app = express();

logger.info("Connecting to the database...", MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to the database...")
    }).catch((error) => {
    logger.error("An error occurred with the database, ", error);
})

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use('/api/blogs', middleware.userExtractor ,blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app;