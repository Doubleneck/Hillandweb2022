import './App.css'
import myLogo from './hlogo.png';
import {
    BrowserRouter as Router,
    Routes, Route, Link
  } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Home from './components/Home'
import News from './components/News'
import Videos from './components/Videos'
import LoginForm from './components/LoginForm'
import TruckerCaps from './components/TruckerCaps';

const App = () => {
  const user = useSelector((state) => state.loginForm.user)
  const padding = {
      padding: 5
  } 
  
    return (
<Router>  
    <Navbar collapseOnSelect expand="lg" className="justify-content-center color-nav" >
      <Navbar.Toggle aria-controls="responsive-navbar-nav"> <img style={{ width: 170, height: 85 }} src={myLogo} alt="Hilland logo"/> </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav"> 
      <Nav className="justify-content-center">
       
        <Navbar.Brand href="/news" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/">HOME</Link>
        </Navbar.Brand>
        <Navbar.Brand href="/news" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/news">NEWS</Link>
        </Navbar.Brand>
        <Navbar.Brand href="/videos" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/videos">VIDEOS</Link>
        </Navbar.Brand>
        <Navbar.Brand href="#" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/releases">RELEASES</Link>
        </Navbar.Brand>
        <Navbar.Brand href="#" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/truckercaps">TRUCKER CAPS</Link>
        </Navbar.Brand>
        <Navbar.Brand href="#" className="linkText m-auto">
          <Link style={padding} className="linkText text-decoration-none" to="/archive">ARCHIVE</Link>
        </Navbar.Brand>
        {user ? (
        <Navbar.Brand href="/">{user.username} logged in</Navbar.Brand>
         ) : (
         <Navbar.Brand href="#"><Link style={padding} className="linkText text-decoration-none" to="/login">login (siirrä tää muualle)</Link></Navbar.Brand>
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
    <Route path="/news" element={<News/>} />
      <Route path="/" element={<Home />} />
      <Route path="/videos" element={<Videos  />} />
      <Route path="/truckercaps" element={<TruckerCaps  />} />
      <Route path="/login" element={<LoginForm  />} />
  </Routes>

  <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
    © 2023 Copyright: Andy's Web Factory
  </div> 
</Router>      
    )
  }

  export default App