import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService.js'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    clearUsers() {
      return []
    }
  }
})

export const { setUsers, clearUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getUsers()
      dispatch(setUsers(users))
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }
}

export default usersSlice.reducer
