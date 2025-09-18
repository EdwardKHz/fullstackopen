const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require("../utils/logger")
const User = require('../models/user')
const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().populate("user", {blogs: 0})
        res.json(blogs)
    } catch (error) {
        logger.error(error)
        res.status(404).end()
    }
})

blogsRouter.post("/", async (req, res) => {
    const {title, author, url, likes} = req.body


    const user = await User.findById(req.user._id)

    if (!user) {
        return res.status(400).json({ error: 'UserId missing or not valid' })
    }

    if (!title || !url) {
        return res.status(400).end();
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    });

    try {

        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        logger.error(error);
        res.status(500).end();
    }
})

blogsRouter.delete("/:id", async (req, res) => {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId)

    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
    }

    if (!(blog.user.toString() === req.user._id.toString())) {
        return res.status(403).json({ error: 'ids do not match' })
    }

    await Blog.findByIdAndDelete(blogId)
    res.status(204).end()
})


module.exports = blogsRouter;