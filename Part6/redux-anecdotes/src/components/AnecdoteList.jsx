import {useDispatch, useSelector} from "react-redux";
import {vote, voteAnecdote} from "../reducers/anecdoteReducer.js";
import {createNotification, setNotification} from "../reducers/notificationReducer.js";

const AnecdoteList = () => {

    const anecdotes = useSelector(state => [...state.anecdotes]
        .filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
        .sort((a, b) => b.votes - a.votes))

    const dispatch = useDispatch()

    const handleVote = id => {
        dispatch(voteAnecdote(id, anecdotes.find(a => a.id === id)))
        dispatch(createNotification(`You have voted for '${anecdotes.find(a => a.id === id).content}'`, 5))
    }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote.id)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList