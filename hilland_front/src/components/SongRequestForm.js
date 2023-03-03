import { useState } from 'react' 
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import Button from 'react-bootstrap/Button'
import Notification from './Notification'

const SongRequestForm = () => {
    const dispatch = useDispatch()
    const [artist, setArtist] = useState('') 
    const [song, setSong] = useState('') 
 
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
        dispatch(setNotification('Thank you!!', 3, 'update'))
      } catch (exception) {
        dispatch(setNotification('Wrong credentials', 3, 'error'))
      }
    } 
   return (
     <div>
       
       
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
         <Notification />
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