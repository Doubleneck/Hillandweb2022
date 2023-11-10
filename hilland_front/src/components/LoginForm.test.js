import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux' // Assuming you are using Redux for store
import configureStore from 'redux-mock-store' // Import redux-mock-store
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter for useNavigate
import LoginForm from './LoginForm'

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


    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

  })


})
