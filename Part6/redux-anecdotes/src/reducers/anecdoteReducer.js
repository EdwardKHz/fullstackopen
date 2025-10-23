import {createSlice} from "@reduxjs/toolkit";
import anecdoteService from "../sevices/anecdoteService.js";

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => {
    return {
        content: anecdote,
        id: getId(),
        votes: 0
    }
}

const initialState = []

const anecdoteSlice = createSlice({
    name: "anecdote",
    initialState,
    reducers: {
        create(state, action) {
            const anecdote = action.payload
            state.push(anecdote)
        },
        vote(state, action) {
            const id = action.payload
            return state.map(anecdote =>
                anecdote.id === id
                    ? {...anecdote, votes: anecdote.votes + 1}
                    : anecdote
            )
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})


export const {setAnecdotes, create, vote} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const appendAnecdote = (content) => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createAnecdote(content)
        dispatch(create(newAnecdote))
    }
}

export const voteAnecdote = (id, anecdote) => {
    return async dispatch => {
        await anecdoteService.voteForAnecdote(id, {
            ...anecdote,
            votes: anecdote.votes + 1
        })
        dispatch(vote(id))
    }
}


export default anecdoteSlice.reducer

