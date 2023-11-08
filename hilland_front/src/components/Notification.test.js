import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux' // Import the Provider
import configureStore from 'redux-mock-store' // Import redux-mock-store
import Notification from './Notification'


const mockStore = configureStore([])

describe('<Notification />', () => {
  it('renders notification with update type', () => {
    const store = mockStore({
      notification: {
        content: 'Notification Content',
        type: 'update',
      },
    })

    const { getByText } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    )

    const notificationElement = getByText('Notification Content')
    expect(notificationElement).toHaveClass('update')
  })

  it('renders notification with error type', () => {
    const store = mockStore({
      notification: {
        content: 'Error Content',
        type: 'error',
      },
    })

    const { getByText } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    )

    const notificationElement = getByText('Error Content')
    expect(notificationElement).toHaveClass('error')
  })


  it('does not render when notification is null', () => {
    const store = mockStore({
      notification: {
        content: null,
        type: 'update',
      },
    })

    const { container } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    )

    // Check that the component renders an empty div when notification is null
    expect(container.firstChild).toBeNull()
  })
})
