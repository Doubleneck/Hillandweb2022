import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mediaService from '../services/media'
import MediaForm from './MediaForm'
import MediaObject from './MediaObject'
import Notification from './Notification'
import Bio from './Bio'

const Media =  () => {
  const [mediaItems, setMediaItems] = useState([])
  const [newMediaobject, setNewMediaobject] = useState(null)
  const [removedMediaobject, setRemovedMediaobject] = useState(null)
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()


  useEffect(() => {
    mediaService
      .getAll()
      .then((mediaItems) =>
        setMediaItems(mediaItems)
      )
  }, [dispatch])

  useEffect(() => {
    if(newMediaobject){
      setMediaItems(mediaItems.concat(newMediaobject))
      setNewMediaobject
    }
  }, [newMediaobject])


  useEffect(() => {
    if (removedMediaobject) {
      setMediaItems((prevMediaItems) =>
        prevMediaItems.filter((mediaItem) => mediaItem.id !== removedMediaobject.id)
      )
      setRemovedMediaobject(null)
    }
  }, [removedMediaobject])


  const handleMediaAdded = (mediaObject) => {
    setNewMediaobject(mediaObject)
  }

  const handleMediaRemoved = (mediaObject) => {
    setRemovedMediaobject(mediaObject)
  }

  return (
    <div >
      <h2 className="mx-auto text-center m-4">Hilland Records Bio:</h2>
      <div >
        <Bio />
      </div>
      {user && user.role === 'admin' && (
        <div>
          <Notification />
          <div className="text-center">
            <div className="text-center">
              <MediaForm onMediaAdded={handleMediaAdded} />
            </div>
          </div>
        </div>
      )}
      <h2 className="mx-auto text-center mt-4">Images for Media:</h2>
      <div className="mx-auto text-center">
        <ul className="gallery ">
          {mediaItems.map((mediaObject) => (
            <li key={mediaObject.id} >
              <MediaObject mediaObject={mediaObject} onMediaRemoved={handleMediaRemoved}/>
            </li>
          ))}
        </ul>
      </div>
    </div>

  )
}

export default Media