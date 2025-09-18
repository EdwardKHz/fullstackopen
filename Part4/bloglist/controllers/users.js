const usersRouter = require('express').Router()
const User = require('../models/user');
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");


usersRouter.post("/", async (req, res) => {
    const {username, name, password} = req.body;

    const userExists = await User.findOne({username});
    if (userExists) {
        return res.status(400).json({error: "User already exists"});
    }

    if (username.length < 3) {
        return res.status(400).json({error: "Username must be at least 3 characters"});
    }

    if (password.length < 3) {
        return res.status(400).json({error: "Password must be at least 3 characters"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        name,
        hashedPassword,
    })

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        logger.error(error);
        res.status(error.status || 400).json({error: error.message});
    }

})

usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({}).populate('blogs', {user: 0});
        res.status(200).json(users);
    } catch (error) {
        logger.error(error);
        res.status(error.status || 400).json({error: error.message});
    }

})

module.exports = usersRouter;