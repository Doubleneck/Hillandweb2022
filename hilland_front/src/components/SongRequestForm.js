import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import Button from 'react-bootstrap/Button'
import Notification from './Notification'
import songrequestService from '../services/songrequests'
import Popover from 'react-bootstrap/Popover'
const SongRequestForm = () => {

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
    <div >
      {!hideRequest && (
        <>
          <p></p>
          <Notification />
          <div >
            <h4 className='mb-3 text-danger'>New  feature!! </h4>
            <h4 className='mb-3 text-danger'>Send us a song request...maybe we&rsquo;ll play it next Monday! </h4>
          </div>
          <Popover className="mx-auto" id="popover-basic">
            <Popover.Header as="h3" className="text-center text-danger" >Song request</Popover.Header>
            <Popover.Body>
              <div>
                <form onSubmit={handleSubmit}>
                  <div>
                    <h3 className="text-center text-danger">Artist:</h3>
                    <input className="form-control text-center" value={artist} onChange={handleArtistChange} />
                    <p className="text-center text-danger">(You can leave this blank)</p>

                    <h3 className="text-center text-danger"> Song: </h3>
                    <input className="form-control text-center" value={song} onChange={handleSongChange} />
                    <p></p>
                    <p className="text-center">
                      <Button type="submit" variant="danger">
    Send !!
                      </Button>
                    </p>
                  </div>
                </form>
                <p></p>

              </div>
            </Popover.Body>
          </Popover>

        </>
      )}
    </div>
  )
}

export default SongRequestForm