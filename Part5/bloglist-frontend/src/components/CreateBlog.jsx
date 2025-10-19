import {useState} from 'react'
import Message from './Message.jsx'

const CreateBlog = ({addBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        addBlog({title, author, url})
        setTitle('')
        setAuthor('')
        setUrl('')
    }


    return (
        <div>
            <h1>create new</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    title:
                    <input
                        type="text"
                        value={title}
                        required={true}
                        onChange={e => setTitle(e.target.value)}
                    />
                </label>
                <br/>
                <label>
                    author:
                    <input
                        type="text"
                        value={author}
                        required={true}
                        onChange={e => setAuthor(e.target.value)}
                    />
                </label>
                <br/>
                <label>
                    url:
                    <input
                        type="text"
                        value={url}
                        required={true}
                        onChange={e => setUrl(e.target.value)}
                    />
                </label>
                <br/>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default CreateBlog