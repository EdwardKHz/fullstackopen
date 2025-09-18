const {test, describe, after, before} = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const assert = require("node:assert");
const {blogToPost, initialBlogs, blogNoLike, blogNoUrl, blogNoTitle} = require("../utils/list_helper");
const Blog = require('../models/blog');

const api = supertest(app);


before(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('Blog api', () => {
    test('GET blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        console.log(response.body)
    })

    test('Check for id attribute', async () => {
        const response = await api.get('/api/blogs')
        let allHaveId = true;

        if (response.body) {
            allHaveId = response.body.every(blog => 'id' in blog && !('_id' in blog))
        }

        assert.strictEqual(allHaveId, true);
    })

    test('POST blogs', async () => {
        await api
            .post('/api/blogs')
            .send(blogToPost)
            .expect(201)

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, initialBlogs.length + 1)
    })

    test('like attribute default', async () => {

        const response = await api
            .post('/api/blogs')
            .send(blogNoLike)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)

    })

    test('No url or title', async () => {

        await api
            .post('/api/blogs')
            .send(blogNoUrl)
            .expect(400)


        await api
            .post('/api/blogs')
            .send(blogNoTitle)
            .expect(400)
    })

})

after(async () => {
    await mongoose.connection.close()
})

