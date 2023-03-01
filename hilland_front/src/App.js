import './App.css'
import myLogo from './hlogo.png';
import {
    BrowserRouter as Router,
    Routes, Route, Link
  } from 'react-router-dom'
//import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Home from './components/Home'
import News from './components/News'
import LoginForm from './components/LoginForm'
import { useSelector } from 'react-redux'
  const App = () => {
    const user = useSelector((state) => state.loginForm.user)
   /*  const padding = {
      padding: 5
    } */
  
    return (
       
      <Router>
<Navbar collapseOnSelect expand="lg" className="justify-content-center color-nav" >
  
  <Navbar.Toggle aria-controls="responsive-navbar-nav"> <img style={{ width: 170, height: 85 }} src={myLogo} alt="Hilland logo"/> </Navbar.Toggle>
  <Navbar.Collapse id="responsive-navbar-nav"> 
    <Nav className="mr-auto">
      <Navbar.Brand href="/" className="linkText m-auto">HOME</Navbar.Brand>
      <Navbar.Brand href="/news" className="linkText m-auto">NEWS</Navbar.Brand>
      <Navbar.Brand href="/videos" className="linkText m-auto">VIDEOS</Navbar.Brand>
      <Navbar.Brand href="/releases" className="linkText m-auto">RELEASES</Navbar.Brand>
      <Navbar.Brand href="/truckercaps" className="linkText m-auto">TRUCKER CAPS</Navbar.Brand>
      <Navbar.Brand href="/archive" className="linkText m-auto">ARCHIVE</Navbar.Brand>
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

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright: Andy's Web Factory
      </div>
       
      </Router>
      
    )
  }

  export default App