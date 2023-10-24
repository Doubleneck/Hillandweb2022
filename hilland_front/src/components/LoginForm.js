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
import Button from 'react-bootstrap/esm/Button'

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
    <div>
      <h2>Login</h2>
      <Notification/>
      <form onSubmit={handleSubmit}>
        <div>
           username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
           password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <Button variant="primary" type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm