import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  password: '',
  user: '',

}

const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setUsernameInStore(state, action) {
      state.username = action.payload
      return state
    },
    setPasswordInStore(state, action) {
      state.password = action.payload
      return state
    },
    resetCredentials(state) {
      state.password = ''
      state.username = ''
      return state
    },

    setUser(state, action) {
      state.user = action.payload
      return state
    },
  },
})

export const {
  setUsernameInStore,
  setPasswordInStore,
  setUser,
  resetCredentials,
} = loginFormSlice.actions
export default loginFormSlice.reducer