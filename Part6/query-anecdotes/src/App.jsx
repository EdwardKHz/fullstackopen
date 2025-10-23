import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteForAnecdote } from './services/anecdotes.js'
import NotificationContext from './notificationContext.jsx'
import { useContext } from 'react'

const App = () => {
  const queryClient = useQueryClient()
  const {setNotification} = useContext(NotificationContext)

  const voteMutation = useMutation({
    mutationFn: voteForAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a),
      )
    },
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
    setNotification(`You have voted for '${anecdote.content}'`, 5)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 0,
  })

  if (result.isLoading) return <div>Loading...</div>

  if (result.isError) return (
    <div>Anecdote service not available due to server problems</div>
  )

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {result.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
