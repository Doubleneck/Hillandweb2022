import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import releaseService from '../services/releases'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'


const ReleaseForm = ({ onReleaseAdded }) => {

  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newYear, setNewYear] = useState('')
  const [newBuyLink, setNewBuyLink] = useState('')
  const [newListenLink, setNewListenLink] = useState('')
  const [imageFile, setImageFile] = useState('')
  const dispatch = useDispatch()

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleYearChange = (event) => {
    setNewYear(event.target.value)
  }

  const handleBuyLinkChange = (event) => {
    setNewBuyLink(event.target.value)
  }

  const handleListenLinkChange = (event) => {
    setNewListenLink(event.target.value)
  }

  const handlePhotoSelect = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const MAX_FILE_SIZE = 1000
    if (file.size / 1000 < MAX_FILE_SIZE) {
      setImageFile(file)
    } else {
      alert('Kuvan maksimikoko on 1M')
    }
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }

  const archiveObject = {
    title: newTitle,
    content: newContent,
    year: newYear,
    buyLink: newBuyLink,
    listenLink: newListenLink,
    imageFile: imageFile,
  }

  const addToReleases = (event) => {
    event.preventDefault()
    createReleaseItem(archiveObject)
    setNewTitle('')
    setNewContent('')
    setNewYear('')
    setImageFile('')
    setNewBuyLink('')
    setNewListenLink('')
    toggleFormVisibility()
  }

  const createReleaseItem = async (releaseItem) => {

    try {
      const releaseObject = await releaseService.create(releaseItem)
      onReleaseAdded(releaseObject)
      dispatch(
        setNotification(`A release: ${releaseObject.title} added!`, 5, 'update')
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
            <h2 className="my-4 text-center">Add Release:</h2>
            <form onSubmit={addToReleases}>
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
                <label>Content:</label>
                <textarea
                  data-cy="content"
                  className="form-control"
                  rows="2"
                  value={newContent}
                  onChange={handleContentChange}
                />
              </div>
              <div className="form-group">
                <label>Year:</label>
                <input
                  data-cy="year"
                  className="form-control"
                  value={newYear}
                  onChange={handleYearChange}
                />
              </div>
              <div className="form-group">
                <label>buyLink:</label>
                <input
                  data-cy="buylink"
                  className="form-control"
                  value={newBuyLink}
                  onChange={handleBuyLinkChange}
                />
              </div>
              <div className="form-group">
                <label>listenLink:</label>
                <input
                  data-cy="listenlink"
                  className="form-control"
                  value={newListenLink}
                  onChange={handleListenLinkChange}
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
                Create Release
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
          Add New Release
          </Button>
        </>
      )}
    </div>
  )
}

ReleaseForm.propTypes = {
  onReleaseAdded: PropTypes.func.isRequired, // onUserAdded is expected to be a function
}
export default ReleaseForm


