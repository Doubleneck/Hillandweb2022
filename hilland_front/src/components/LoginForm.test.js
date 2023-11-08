import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux' // Assuming you are using Redux for store
import configureStore from 'redux-mock-store' // Import redux-mock-store
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter for useNavigate

import LoginForm from './LoginForm'

// Mock the useNavigate hook
// jest.mock('react-router-dom', () => {
//   return {
//     useNavigate: () => jest.fn(),
//   }
// })
const mockStore = configureStore([])

describe('<LoginForm />', () => {
  it('renders login form and handles submission', async () => {
    const store = mockStore({
      notification: {
        content: 'Notification Content',
        type: 'update',
      },
    })
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    )

    const usernameInput = screen.getByPlaceholderText('Enter username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByText('Login', { selector: 'button' })

    // Fill in the form inputs
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Mock your loginService.login as needed
    // If it's an asynchronous function, you may use jest.spyOn
    // to mock its implementation with a Promise resolved with user data.

    // Trigger form submission
    fireEvent.click(submitButton)

    // Add your expectations here, like checking if the user is logged in,
    // or if a success notification is shown.
  })

  // Add more test cases for different scenarios
})
