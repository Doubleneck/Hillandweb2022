import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import releaseService from '../services/releases'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const UpdateReleaseForm = ({ releaseObjectToBeUpdated, onReleaseUpdated }) => {

  const dispatch = useDispatch()
  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState(releaseObjectToBeUpdated.title)
  const [newContent, setNewContent] = useState(releaseObjectToBeUpdated.content)
  const [newBuyLink, setNewBuyLink] = useState(releaseObjectToBeUpdated.buyLink)
  const [newListenLink, setNewListenLink] = useState(releaseObjectToBeUpdated.listenLink)
  const [newYear, setNewYear] = useState(releaseObjectToBeUpdated.year !== undefined
    ? releaseObjectToBeUpdated.year.toString()
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

  const handleBuyLinkChange = (event) => {
    setNewBuyLink(event.target.value)
  }

  const handleListenLinkChange = (event) => {
    setNewListenLink(event.target.value)
  }


  const updatedReleaseObject = {
    title: newTitle,
    content: newContent,
    year: newYear,
    buyLink: newBuyLink,
    listenLink: newListenLink,
    imageURL: releaseObjectToBeUpdated.imageURL,
    id: releaseObjectToBeUpdated.id,
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }

  const updateRelease = (event) => {
    event.preventDefault()
    updateThisReleaseItem(updatedReleaseObject)
    toggleFormVisibility()
  }

  const updateThisReleaseItem = async (updatedReleaseObject) => {

    try {
      const updatedReleaseItem = await releaseService.update(releaseObjectToBeUpdated.id, updatedReleaseObject)
      onReleaseUpdated(updatedReleaseItem)
      dispatch(
        setNotification(`Updated ${updatedReleaseItem.title}`, 5, 'update')
      )
    } catch (error) {
      const serverError = error.response.data
      dispatch(
        setNotification(
          serverError.error ||
          'Something went wrong while trying to update a release',
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
            <h2 className='text-center'>Update this release</h2>
            <form onSubmit={updateRelease }>
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
              <div className='form-group'>
                <label>buyLink:</label>
                <input
                  data-cy='buylinkr'
                  className='form-control'
                  value={newBuyLink}
                  onChange={handleBuyLinkChange}
                />
              </div>
              <div className='form-group'>
                <label>listenLink:</label>
                <input
                  data-cy='listenlink'
                  className='form-control'
                  value={newListenLink}
                  onChange={handleListenLinkChange}
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
          Update Release
        </Button>
      )}
    </div>
  )
}

UpdateReleaseForm.propTypes = {
  releaseObjectToBeUpdated: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    year: PropTypes.number.isRequired,
    buyLink: PropTypes.string,
    listenLink: PropTypes.string,
    imageURL: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onReleaseUpdated: PropTypes.func.isRequired,
}

export default UpdateReleaseForm
