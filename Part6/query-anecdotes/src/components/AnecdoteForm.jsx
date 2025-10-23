import { createAnecdote } from '../services/anecdotes.js'
import { useMutation , useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from '../notificationContext.jsx'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const {setNotification} = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      setNotification(`You have created '${newAnecdote.content}'`, 5)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      setNotification(`Error: Anecdote must be at least 5 characters long`, 5)
      return
    }
    newAnecdoteMutation.mutate(content)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
