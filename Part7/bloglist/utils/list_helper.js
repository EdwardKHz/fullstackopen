const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }]

const blogToPost = {
    title: "React patterns",
    author: "Edward",
    url: "https://reactpatterns.com/",
    likes: 10
}

const blogNoLike = {
    title: "React patterns",
    author: "Edward",
    url: "https://reactpatterns.com/"
}

const blogNoUrl = {
    title: "React patterns",
    author: "Edward",
    likes: 4
}

const blogNoTitle = {
    author: "Edward",
    url: "https://reactpatterns.com/",
    likes: 5
}


const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum += blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((favorite, blog) =>
        blog.likes > favorite.likes ? blog : favorite
    )
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const counts = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + 1;
        return authors;
    }, {})

    const topAuthor = Object.keys(counts).reduce((most, author) => {
        return counts[author] > counts[most] ? author : most;
    })

    return {author: topAuthor, blogs: counts[topAuthor]};
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const likes = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + blog.likes;
        return authors;
    }, {})

    const mostLiked = Object.keys(likes).reduce((most, author) => {
        return likes[author] > likes[most] ? author : most;
    })

    return {author: mostLiked, likes: likes[mostLiked]};
}
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, initialBlogs , blogToPost, blogNoLike, blogNoUrl, blogNoTitle
}