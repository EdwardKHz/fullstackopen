const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username})
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.hashedPassword)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({error: "Invalid Credentials"})
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res.status(200).send({token, username:username, name: user.name})
})

module.exports = loginRouter;