import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../graphql/queries'
import UpdateAuthor from './UpdateAuthor.jsx'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (!props.show) {
    return null
  }

  if(result.error){
    return <div>Error loading authors: {result.error.message}</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateAuthor authors={result.data.allAuthors} token={props.token} />
    </div>
  )
}

export default Authors
