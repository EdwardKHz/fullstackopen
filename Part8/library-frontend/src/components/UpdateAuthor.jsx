import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR } from '../graphql/mutations.js'
import { ALL_AUTHORS } from '../graphql/queries.js'

const UpdateAuthor = ({ authors, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateAuthor({ variables: { name, setBornTo: Number(born) } })
    setName('')
    setBorn('')
  }

  if (!token) {
    return null
  }


  return (
    <div>
      <h1>Set birthyear</h1>
      <form onSubmit={handleSubmit}>
        <select value={name} onChange={e => setName(e.target.value)}>
            <option value="" disabled>Select author</option>
          {authors.map((author) => (
            <option key={author.name} value={author.name}>{author.name}</option>
          ))}
        </select>
          <br />
          <label>
            born
            <input
              type="number"
              value={born}
              onChange={e => setBorn(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">update author</button>
      </form>
    </div>
)
}

export default UpdateAuthor