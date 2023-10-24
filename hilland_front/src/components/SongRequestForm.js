import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import Button from 'react-bootstrap/Button'
import Notification from './Notification'
import songrequestService from '../services/songrequests'
//import Button from 'react-bootstrap/Button'
//import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
const SongRequestForm = () => {
  // const popover = (
  //   <Popover id="popover-basic">
  //     <Popover.Header as="h3" className="text-center text-danger" >Song Request</Popover.Header>
  //     <Popover.Body>
  //     <div>
  //         <SongRequestForm />
  //     </div>
  //     </Popover.Body>
  //   </Popover>
  // );

  // const SongRequest = () => (
  //   <OverlayTrigger trigger="click" placement="top" overlay={popover}>
  //     <Button variant="danger">Song request</Button>
  //   </OverlayTrigger>
  // )
  const dispatch = useDispatch()
  const [artist, setArtist] = useState('')
  const [song, setSong] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false) // State to track form submission
  const [hideRequest, setHideRequest] = useState(false) // State to hide the "Song Request" component

  const handleArtistChange = (event) => {
    setArtist(event.target.value)
  }

  const handleSongChange = (event) => {
    setSong(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const songRequest = {
        artist,
        song,
      }
      console.log(songRequest)
      await songrequestService.create(songRequest)
      setArtist('')
      setSong('')
      setFormSubmitted(true)

      // Show the "Song Request" component
      setHideRequest(false)

      // Dispatch a success notification
      dispatch(setNotification('Thank you!!', 2, 'update'))
    } catch (exception) {
      dispatch(setNotification('We couldn´t take your request, try again later..', 2, 'error'))
    }
  }

  // Effect to hide "Song Request" component after 5 seconds
  useEffect(() => {
    if (formSubmitted) {
      const hideTimer = setTimeout(() => {
        setHideRequest(true)
      }, 2000)

      return () => clearTimeout(hideTimer)
    }
  }, [formSubmitted])

  return (
    <div className="text-center">


      {!hideRequest && (

        <Popover id="popover-basic">
          <Popover.Header as="h3" className="text-center text-danger" >Song Request</Popover.Header>
          <Popover.Body>
            <div>
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-center text-danger">Artist:</h3>
                  <input value={artist} onChange={handleArtistChange} />
                  <p className="text-center text-danger">(You can leave this blank)</p>
                  <Notification />
                  <h3 className="text-center text-danger"> Song: </h3>
                  <input type="song" value={song} onChange={handleSongChange} />
                  <p></p>
                  <p className="text-center">
                    <Button type="submit" variant="danger">
    Send !!
                    </Button>
                  </p>
                </div>
              </form>
            </div>
          </Popover.Body>
        </Popover>
      )}
    </div>
  )
}

export default SongRequestForm