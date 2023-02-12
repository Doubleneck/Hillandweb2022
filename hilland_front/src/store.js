

import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import newsReducer from './reducers/newsReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    news: newsReducer,
  },
})

export default store