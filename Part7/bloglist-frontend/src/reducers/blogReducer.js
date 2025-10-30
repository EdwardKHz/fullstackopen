import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogService.js'

const blogReducer = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
      setBlogs(state, action) {
        return action.payload
      },
      appendBlog(state, action) {
        state.push(action.payload)
      },
      changeBlog(state, action) {
        const updatedBlog = action.payload
        return state.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog,
        )
      },
      removeBlog(state, action) {
        const id = action.payload
        return state.filter((blog) => blog.id !== id)
      }
    },
  },
)

export const { setBlogs, appendBlog, changeBlog, removeBlog } = blogReducer.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogData) => {
  return async (dispatch) => {
    const newBlog = await blogService.addBlog(blogData)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlog = (blogData) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog(blogData.id, blogData)
    dispatch(changeBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}
export default blogReducer.reducer