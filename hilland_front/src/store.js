

import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer.js'
import newsReducer from './reducers/newsReducer.js'
import loginFormReducer from './reducers/loginFormReducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    news: newsReducer,
    loginForm: loginFormReducer,
  },
})

export default store