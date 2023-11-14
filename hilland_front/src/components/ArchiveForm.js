import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import archiveService from '../services/archives'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'

const ArchiveForm = ({ onArchiveAdded }) => {

  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newYear, setNewYear] = useState('')
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
    imageFile: imageFile,
  }

  const addToArchives = (event) => {
    event.preventDefault()
    createArchiveItem(archiveObject)
    setNewTitle('')
    setNewContent('')
    setNewYear('')
    setImageFile('')
    toggleFormVisibility()
  }

  const createArchiveItem = async (archiveItem) => {

    try {
      const archiveObject = await archiveService.create(archiveItem)
      onArchiveAdded(archiveObject)
      dispatch(
        setNotification(`A news: ${archiveObject.title} added!`, 5, 'update')
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
            <h2 className="my-4 text-center">Add Archive Item:</h2>
            <form onSubmit={addToArchives}>
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
                Create Archive Item
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
          Add New One To Archives
          </Button>
        </>
      )}
    </div>
  )
}

ArchiveForm.propTypes = {
  onArchiveAdded: PropTypes.func.isRequired, // onUserAdded is expected to be a function
}
export default ArchiveForm


