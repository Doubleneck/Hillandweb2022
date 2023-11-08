import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux' // Import the Provider
import configureStore from 'redux-mock-store' // Import the store creator
import Home from './Home'

const mockStore = configureStore() // Create a mock store
const store = mockStore({}) // Initialize the mock store

test('renders content', () => {
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  )
  // Your test assertions here
})
