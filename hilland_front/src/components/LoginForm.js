import React from 'react'
import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginFormReducer'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
import newsService from '../services/news'
import userService from '../services/users'
import songrequestService from '../services/songrequests'
import loginService from '../services/login'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      songrequestService.setToken(user.token)
      newsService.setToken(user.token)
      userService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      dispatch(setNotification('Wrong credentials', 3, 'error'))
    }
  }

  return (
    <Container className="text-center">
      <h2>Login</h2>
      <Notification />
      <Form onSubmit={handleSubmit}>
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              data-cy='username'
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              data-cy='password'
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <p></p>
          <Button  data-cy="login" variant="primary" type="submit" style={{ width: '100%' }}>
            Login
          </Button>
        </Col>
      </Form>
    </Container>
  )
}

export default LoginForm
