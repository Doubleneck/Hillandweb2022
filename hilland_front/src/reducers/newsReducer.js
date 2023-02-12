import { createSlice } from '@reduxjs/toolkit'
const initialState = []

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    removeNewsobject(state, action) {
      const id = action.payload
      return state.filter((news) => news.id !== id)
    },
    appendNewsobject(state, action) {
      state.push(action.payload)
    },
    setNews(state, action) {
      return action.payload
    },
  },
})

export const { removeNewsobject, appendNewsobject, setNews } =
  newsSlice.actions

export default newsSlice.reducer