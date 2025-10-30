import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import Login from './components/Login.jsx'
import blogService from './services/blogService.js'
import login from './services/logInService.js'
import CreateBlog from './components/CreateBlog.jsx'
import Togglable from './components/Togglable.jsx'
import Message from './components/Message.jsx'
import { createNotification } from './reducers/notificationReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, initializeBlogs, updateBlog, deleteBlog } from './reducers/blogReducer.js'
import { clearUser, setUser } from './reducers/userReducer.js'
import Users from './components/Users.jsx'


const App = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const notification = useSelector(state => state.notification)
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)


    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('user')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
        dispatch(initializeBlogs())
    }, [])


    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const user = await login({username, password})
            dispatch(setUser(user))
            window.localStorage.setItem('user', JSON.stringify(user))
            blogService.setToken(user.token)
            setUsername('')
            setPassword('')
        } catch (error) {
            console.log(error)
            dispatch(createNotification())
        }
    }

    const addBlog = async (blogObject) => {
        try {
            dispatch(createBlog(blogObject))
            dispatch(createNotification('a new blog ' + blogObject.title + ' by ' + blogObject.author + ' added'))
        } catch (error) {
            dispatch(createNotification(error.message))
        }
    }

    const updateLikes = async (blog) => {
        const newBlog = {
            ...blog,
            likes: blog.likes + 1,
        }
        try {
            dispatch(updateBlog(newBlog))
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteBlog = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await dispatch(deleteBlog(blog.id))
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    dispatch(createNotification('You are not authorized to delete this blog'))
                } else {
                    dispatch(createNotification('Something went wrong'))
                }
            }
        }
    }


    const handleLogOut = () => {
        dispatch(clearUser())
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
                .map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={handleDeleteBlog}
                                   username={user.username}/>)}

            <Users />
        </div>
    )
}


export default App