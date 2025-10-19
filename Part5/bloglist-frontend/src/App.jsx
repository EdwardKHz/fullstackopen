import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import Login from './components/Login.jsx'
import blogService from './services/blogService.js'
import login from './services/logInService.js'
import CreateBlog from './components/CreateBlog.jsx'
import Togglable from './components/Togglable.jsx'
import Message from './components/Message.jsx'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState(null)
    const [user, setUser] = useState(null)


    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('user')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])


    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const user = await login({username, password})
            setUser(user)
            window.localStorage.setItem('user', JSON.stringify(user))
            blogService.setToken(user.token)
            setUsername('')
            setPassword('')
        } catch (error) {
            console.log(error)
            setNotification('Wrong credentials')
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const addBlog = async (blogObject) => {
        try {
            const addedBlog = await blogService.addBlog(blogObject)
            setBlogs(blogs.concat(addedBlog))
            setNotification('a new blog ' + addedBlog.title + ' by ' + addedBlog.author + ' added')
            setTimeout(() => setNotification(null), 5000)
        } catch (error) {
            setNotification(error.message)
            setTimeout(() => setNotification(null), 5000)
        }
    }

    const updateLikes = async (blog) => {
        const newBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id
        }
        try {
            const updatedBlog = await blogService.updateBlog(blog.id, newBlog)
            setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBlog = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.deleteBlog(blog.id)
                setBlogs(blogs.filter(b => b.id !== blog.id))
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    setNotification('You are not authorized to delete this blog')
                } else {
                    setNotification(error.message)
                }
                setTimeout(() => setNotification(null), 5000)
            }
        }
    }


    const handleLogOut = () => {
        setUser(null)
        window.localStorage.clear()
        blogService.setToken(null)
    }

    if (!user) {
        return <Login username={username} password={password} setUsername={setUsername} setPassword={setPassword}
                      handleSubmit={handleSubmit} error={notification}/>
    }

    return (
        <div>
            <h2>blogs</h2>
            {notification && <Message message={notification}/>}
            <div>
                {user.name} logged in
                <button onClick={handleLogOut}>logout</button>
            </div>
            <br/>
            <Togglable buttonLabel="create new blog">
                <CreateBlog addBlog={addBlog}/>
            </Togglable>
            <br/>
            {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog}
                                   username={user.username}/>)}
        </div>
    )
}


export default App