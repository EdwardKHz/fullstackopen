import Message from './Message.jsx'


const login = ({username, password, handleSubmit, setUsername, setPassword, error}) => (
    <div>
        <h1>log in to application</h1>
        {error && <Message message={error}/>}
        <form onSubmit={handleSubmit}>
            <label>
                username
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    required={true}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </label>
            <br/>
            <label>
                password
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            <br/>
            <button type="submit">log in</button>
        </form>
    </div>
)

export default login