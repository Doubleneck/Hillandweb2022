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
      return state.sort((a, b) => b.date.localeCompare(a.date))
    },
    updateNewsobject(state, action) {
      const id = action.payload.id
      const updatedNews = action.payload
      return state.map((news) => (news.id !== id ? news : updatedNews))
    },
    setNews(state, action) {
      return action.payload
    },
  },
})

export const { removeNewsobject, appendNewsobject, updateNewsobject, setNews } =
  newsSlice.actions

export default newsSlice.reducer