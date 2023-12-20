import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import mediaService from '../services/media'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'


const MediaForm = ({ onMediaAdded }) => {

  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [imageFile, setImageFile] = useState('')
  const dispatch = useDispatch()

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handlePhotoSelect = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const MAX_FILE_SIZE = 1000
    if (file.size / 10000 < MAX_FILE_SIZE) {
      setImageFile(file)
    } else {
      alert('Kuvan maksimikoko on 10M')
    }
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }

  const mediaObject = {
    title: newTitle,
    imageFile: imageFile,
  }

  const addToMedia = (event) => {
    event.preventDefault()
    createMediaItem(mediaObject)
    setNewTitle('')
    toggleFormVisibility()
  }

  const createMediaItem = async (mediaItem) => {

    try {
      const mediaObject = await mediaService.create(mediaItem)
      onMediaAdded(mediaObject)
      dispatch(
        setNotification(`A media item: ${mediaObject.title} added!`, 5, 'update')
      )
    } catch (error) {
      dispatch(
        setNotification(error.response.data.error, 5, 'error')
      )
    }
  }

  return (
    <div className="container">
      {isFormVisible ? (
        <Card>
          <Card.Body>
            <h2 className="my-4 text-center">Add Media:</h2>
            <form onSubmit={addToMedia}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  data-cy="title"
                  className="form-control"
                  value={newTitle}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="form-group">
                <label>File:</label>
                <input
                  data-cy="imageFile"
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />
              </div>
              <Button data-cy="create-button"   variant="success" type="submit" className="my-2">
                Create Media Item
              </Button>
              <Button variant="primary" onClick={toggleFormVisibility}>
          Close form
              </Button>
            </form>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Button variant="primary" onClick={toggleFormVisibility}>
          Add Media
          </Button>
        </>
      )}
    </div>
  )
}

MediaForm.propTypes = {
  onMediaAdded: PropTypes.func.isRequired, // onUserAdded is expected to be a function
}
export default MediaForm