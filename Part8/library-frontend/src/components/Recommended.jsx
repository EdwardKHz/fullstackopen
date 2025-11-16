import { useQuery } from '@apollo/client/react'
import { BOOKS_BY_GENRE, ME } from '../graphql/queries.js'

const Recommended = ({show}) => {

  const user = useQuery(ME)
  const result = useQuery(BOOKS_BY_GENRE, {
    variables : {genre: user.data?.me?.favoriteGenre},
    skip: !user.data?.me?.favoriteGenre
  })

  if (!show) {
    return null
  }

  if (ME.loading || result.loading) {
    return <div>Loading...</div>
  }


  const filteredBooks = result.data.allBooks.filter(b => b.genres.includes(user.data.me.favoriteGenre))

  return (
    <div>
      <h1>recommendations</h1>
      <p>books in your favorite genre <b>{user.data.me.favoriteGenre}</b></p>
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {filteredBooks.map((b) => (
          <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )

}

export default Recommended