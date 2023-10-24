import React from 'react'
import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginFormReducer'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
import newsService from '../services/news'
import songrequestService from '../services/songrequests'
import loginService from '../services/login'
import s3Service from '../services/s3'
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
      s3Service.setToken(user.token)
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
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" block>
            Login
          </Button>
        </Col>
      </Form>
    </Container>
  )
}

export default LoginForm





