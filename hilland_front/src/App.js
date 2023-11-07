import React from 'react'
import './App.css'
import myLogo from './assets/hlogo.png'
import jwt_decode from 'jwt-decode'
import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, NavLink, Link
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import { setNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import newsService from './services/news'
import songrequestService from './services/songrequests'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Home from './components/Home'
import News from './components/News'
import Videos from './components/Videos'
import LoginForm from './components/LoginForm'
import TruckerCaps from './components/TruckerCaps'
import SongRequests from './components/SongRequests'
import Button from 'react-bootstrap/Button'


const App = () => {
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()
  const padding = {
    padding: 5
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(parsedUser.token)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        dispatch(setUser(parsedUser))
        newsService.setToken(parsedUser.token)
        songrequestService.setToken(parsedUser.token)
      } else {
        logout()
      }
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your code to run at the specified interval (every minute)
      const loggedUserJSON = window.localStorage.getItem('loggedUser')
      if (loggedUserJSON) {
        const parsedUser = JSON.parse(loggedUserJSON)
        const decodedToken = jwt_decode(parsedUser.token)
        const expiresAtMillis = decodedToken.exp * 1000
        if (expiresAtMillis < Date.now()) {
          logout()
          dispatch(setNotification('Your session has expired. Please log in again.', 15, 'error'))
        }
      }
    }, 600000) // 60,000 milliseconds = 60 seconds

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array to run the effect only once on mount

  function logout() {
    dispatch(setUser(''))
    window.localStorage.clear()
    newsService.setToken(null)
    songrequestService.setToken(null)
  }

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" className="justify-content-center color-nav" >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="mx-auto"> <img style={{ width: 170, height: 85 }} src={myLogo} alt="Hilland logo"/> </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-center">
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/">HOME</NavLink>
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/news">NEWS</NavLink>
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/videos">VIDEOS</NavLink>
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/releases">RELEASES</NavLink>
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/truckercaps">TRUCKER CAPS</NavLink>
            <NavLink style={padding} className="linkText m-auto text-decoration-none" to="/archive">ARCHIVE</NavLink>
            {user && (
              <NavLink style={padding} className="linkText m-auto text-decoration-none songRequestLink" to="/songrequests">SONGREQUESTS</NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <>
        {user ? (
          <>
            <h1 className='text-center' >{user.username} logged in
              <Button variant="dark" onClick={logout}>
                Logout
              </Button>
            </h1>
            <p></p>
          </>
        ) : (
          <><Notification /></>
        )}
      </>
      <Routes>
        <Route path="/news" element={<News/>} />
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos  />} />
        <Route path="/truckercaps" element={<TruckerCaps  />} />
        <Route path="/login" element={<LoginForm  />} />
        {user && (
          <Route path="/songrequests" element={<SongRequests />} />
        )}
      </Routes>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
    © 2023 Copyright: AndyLand Web Factory
        <p></p>
        {!user && (
          <Link to="/login" className="linkText m-auto text-decoration-none" style={padding}>Stuff login </Link>
        )}
      </div>
    </Router>
  )
}

export default App