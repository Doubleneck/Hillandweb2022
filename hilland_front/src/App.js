import {
    BrowserRouter as Router,
    Routes, Route, Link
  } from 'react-router-dom'
import Home from './components/Home'
import News from './components/News'
import LoginForm from './components/LoginForm'
import { useSelector } from 'react-redux'
  const App = () => {
    const user = useSelector((state) => state.loginForm.user)
    const padding = {
      padding: 5
    }
  
    return (
      <Router>
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/news">news</Link>
          {user
            ? <em>{user.username} logged in</em>
            : <Link style={padding} to="/login">login</Link>
          }
        </div>
  
        <Routes>
          <Route path="/news" element={<News />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm  />} />
        </Routes>
  
        <div>
          <i>Hilland app, Andy´s web 2023</i>
        </div>
      </Router>
    )
  }

  export default App