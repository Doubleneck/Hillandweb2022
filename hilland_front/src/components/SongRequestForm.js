import { useState } from 'react' 
import Button from 'react-bootstrap/Button';
import store from '../store'
import {
  // ...
  useNavigate
} from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const SongRequestForm = () => {
    const [artist, setArtist] = useState('') 
    const [song, setSong] = useState('') 
    const navigate = useNavigate() 

    const handleArtistChange = (event) => {
      setArtist(event.target.value)
    }
    const handleSongChange = (event) => {
      setSong(event.target.value)
    }  

    const handleSubmit = async (event) => {
      event.preventDefault()
      const date = Date.now()
      try {
         const songRequest = {
          artist,
          song,
          date
        }
        console.log(songRequest)
        setArtist('')
        setSong('')
        store.dispatch(setNotification('Thank you!!', 3, 'update'))
      } catch (exception) {
        store.dispatch(setNotification('Wrong credentials', 3, 'error'))
      }
    } 
   return (
     <div>
       
       <Notification />
       <form onSubmit={handleSubmit}>
         <div>
         <h3 className="text-center text-danger"  >Artist:</h3>
           <input
             value={artist}
             onChange={handleArtistChange}
           />
         <p className="text-center text-danger">(You can leave this blank)</p>  
         </div>
         <div>
         <h3 className="text-center text-danger"> Song: </h3>
           <input
             type="song"
             value={song}
             onChange={handleSongChange}
           />
           <p></p>
           <p className="text-center"> <Button  type="submit" variant="danger">Send !!</Button></p>
        
        <div>   </div>
       </div>
       
       </form>
     </div>
   )
 }
 
 export default SongRequestForm