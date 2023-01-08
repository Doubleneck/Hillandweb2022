import { useState } from 'react' 
const LoginForm = ({
    handleSubmit 
    }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('') 
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }  
    const userObject = {
        username : username,
        password : password
    }
    const loginEvent = (event) => {
        event.preventDefault()
        handleSubmit(userObject)
        setUsername('')
        setPassword('')
    } 
   return (
     <div>
       <h2>Login</h2>
 
       <form onSubmit={loginEvent}>
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