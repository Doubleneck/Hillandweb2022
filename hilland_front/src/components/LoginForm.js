import { useState } from 'react' 
import newsService from '../services/news'
import loginService from '../services/login'
import s3Service from '../services/s3'
import store from '../store'
import { setNotification } from '../reducers/notificationReducer'
import {
  setUser,
} from '../reducers/loginFormReducer'
const LoginForm = () => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')  

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
        window.localStorage.setItem('loggedHillandappUser', JSON.stringify(user))
        newsService.setToken(user.token)
        s3Service.setToken(user.token)
        store.dispatch(setUser(user))
        setUsername('')
        setPassword('')
        //navigate('/')
      } catch (exception) {
        store.dispatch(setNotification('Wrong credentials', 3, 'error'))
      }
    } 
   return (
     <div>
       <h2>Login</h2>
 
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
         <button type="submit">login</button>
       </form>
     </div>
   )
 }
 
 export default LoginForm