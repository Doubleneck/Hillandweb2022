import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      if (state.timeout) {
        console.log('timeout löytyy:', state.timeout)
        clearTimeout(state.timeout)
      }
      console.log('action.payload.content:', action.payload.content)
      state.content = action.payload.content
      state.type = action.payload.type
      state.timeout = action.payload.timeoutID
      return state
    },
    clearNotification() {
      console.log('clear')
      return initialState
    },
  },
})

export const setNotification = (content, time, type) => {
  console.log('setNotification ', content, time)
  const ms = time * 1000
  return async (dispatch) => {
    const timeoutID = setTimeout(() => {
      dispatch(clearNotification())
    }, ms)
    const notification = {
      content: content,
      timeoutID: timeoutID,
      type: type,
    }
    dispatch(createNotification(notification))
  }
}

export const { createNotification, clearNotification } =
  notificationSlice.actions
export default notificationSlice.reducer