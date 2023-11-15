import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import archiveService from '../services/archives'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const UpdateArchiveForm = ({ archiveObjectToBeUpdated, onArchiveUpdated }) => {

  const dispatch = useDispatch()
  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState(archiveObjectToBeUpdated.title)
  const [newContent, setNewContent] = useState(archiveObjectToBeUpdated.content)
  const [newYear, setNewYear] = useState(archiveObjectToBeUpdated.year !== undefined
    ? archiveObjectToBeUpdated.year.toString()
    : '')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleYearChange = (event) => {
    setNewYear(event.target.value)
  }

  const updatedArchiveObject = {
    title: newTitle,
    content: newContent,
    year: newYear,
    imageURL: archiveObjectToBeUpdated.imageURL,
    id: archiveObjectToBeUpdated.id,
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }

  const updateArchives = (event) => {
    event.preventDefault()
    updateThisArchiveItem(updatedArchiveObject)
    toggleFormVisibility() // Close the form after submission
  }

  const updateThisArchiveItem = async (updatedArchiveObject) => {

    try {
      const updatedArchiveItem = await archiveService.update(archiveObjectToBeUpdated.id, updatedArchiveObject)
      onArchiveUpdated(updatedArchiveItem)
      dispatch(
        setNotification(`Updated ${updatedArchiveItem.title}`, 5, 'update')
      )
    } catch (error) {
      const serverError = error.response.data
      dispatch(
        setNotification(
          serverError.error ||
          'Something went wrong while trying to update archive item',
          5,
          'error'
        )
      )
    }
  }

  return (
    <div className='container my-4'>
      {isFormVisible ? (
        <Card>
          <Card.Body>
            <h2 className='text-center'>Update this archive item</h2>
            <form onSubmit={updateArchives }>
              <div className='form-group'>
                <label>Title:</label>
                <input
                  data-cy='title'
                  className='form-control'
                  value={newTitle}
                  onChange={handleTitleChange}
                />
              </div>
              <div className='form-group'>
                <label>Content:</label>
                <input
                  data-cy='content'
                  className='form-control'
                  value={newContent}
                  onChange={handleContentChange}
                />
              </div>
              <div className='form-group'>
                <label>Year:</label>
                <input
                  data-cy='year'
                  className='form-control'
                  value={newYear}
                  onChange={handleYearChange}
                />
              </div>
              <Button
                data-cy='update-button'
                variant='success'
                type='submit'
                className='my-2'
              >
                Update
              </Button>
              <Button variant='primary' onClick={toggleFormVisibility}>
                Close form
              </Button>
            </form>
          </Card.Body>
        </Card>
      ) : (
        <Button variant='primary' onClick={toggleFormVisibility}>
          Update Archive Item
        </Button>
      )}
    </div>
  )
}

UpdateArchiveForm.propTypes = {
  archiveObjectToBeUpdated: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    imageURL: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onArchiveUpdated: PropTypes.func.isRequired,
}

export default UpdateArchiveForm
