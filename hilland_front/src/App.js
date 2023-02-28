import './App.css'
import {
    BrowserRouter as Router,
    Routes, Route, Link
  } from 'react-router-dom'
//import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
//import 'bootstrap/dist/css/bootstrap.min.css'
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
<Navbar  collapseOnSelect expand="lg" className="color-nav" >
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav"> 
    <Nav className="mr-auto">
      <Navbar.Brand href="/" className="linkText">HOME</Navbar.Brand>
      <Navbar.Brand href="/news" className="linkText">NEWS</Navbar.Brand>
      <Navbar.Brand href="/releases" className="linkText">RELEASES</Navbar.Brand>
      {user ? (
        <Navbar.Brand href="/">{user.username} logged in</Navbar.Brand>
       ) : (
       <Navbar.Brand href="/login">LOGIN</Navbar.Brand>
      )}
    </Nav>       
  </Navbar.Collapse>
</Navbar>
<>
        {user ? (
            <h1>{user.username} logged in</h1>
           ) : (
           <></>
          )}
</>
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