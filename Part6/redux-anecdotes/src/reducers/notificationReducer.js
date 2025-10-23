import {createSlice} from "@reduxjs/toolkit";

const notificationReducer = createSlice({
    name: "notification",
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const {setNotification, clearNotification} = notificationReducer.actions

export const createNotification = (message, duration) => {
    return async dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, duration * 1000)
    }
}

export default notificationReducer.reducer