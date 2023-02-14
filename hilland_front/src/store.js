

import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import newsReducer from './reducers/newsReducer'
import loginFormReducer from './reducers/loginFormReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    news: newsReducer,
    loginForm: loginFormReducer,
  },
})

export default store