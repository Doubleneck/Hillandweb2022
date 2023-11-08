import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: '', type: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      state.content = action.payload.content
      state.type = action.payload.type
      return state
    },
    clearNotification() {
      return initialState
    },
  },
})

export const setNotification = (content, time, type) => {
  const ms = time * 1000
  return async (dispatch) => {
    const notification = {
      content: content,
      type: type,
    }
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, ms)
  }
}

export const { createNotification, clearNotification } =
  notificationSlice.actions
export default notificationSlice.reducer