import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../graphql/queries.js'
import { useState } from 'react'

const Books = ({show}) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const result = useQuery(ALL_BOOKS) // to get genres
  const filteredResult = useQuery(BOOKS_BY_GENRE, {
    variables: {genre: selectedGenre}
  })

  console.log(filteredResult)
  if (result.loading || filteredResult.loading) {
    return <div>Loading...</div>
  }

  if (!show) {
    return null
  }

  if (result.error) return <div>Error loading genres: {result.error.message}</div>
  if (filteredResult.error) return <div>Error loading books: {filteredResult.error.message}</div>


  const genresSet = new Set()
  result.data.allBooks.forEach((b) => {
    b.genres.forEach((g) => genresSet.add(g))
  })
  const genres = Array.from(genresSet)

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredResult.data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(g => (
        <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>all books</button>
    </div>
  )
}

export default Books
