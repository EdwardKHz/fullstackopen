const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy function', () => {
    const blogs = []

    const result = listHelper.dummy()
    assert.strictEqual(result, 1)
})

describe('total likes', () => {

    test('total likes', () => {
        const likes = listHelper.totalLikes(listHelper.initialBlogs)

        assert.strictEqual(likes, 12)
    })

})

describe('favorite blog', () => {

    test('most liked', () => {
        const favorite = listHelper.favoriteBlog(listHelper.initialBlogs)

        assert.deepStrictEqual(favorite, listHelper.initialBlogs[0])
    })

})

describe('most blogs', () => {

    test('best author', () => {
        const topAuthor = listHelper.mostBlogs(listHelper.initialBlogs)

        assert.deepStrictEqual(topAuthor, {author: "Michael Chan", blogs: 1})
    })
})

describe('most likes', () => {

    test('most liked author', () => {
        const bestAuthor = listHelper.mostLikes(listHelper.initialBlogs)

        assert.deepStrictEqual(bestAuthor, { author: 'Michael Chan', likes: 7 })
    })
})