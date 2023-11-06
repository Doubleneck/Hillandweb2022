import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { updateNewsobject } from '../reducers/newsReducer'
import newsService from '../services/news'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const UpdateNewsForm = ({ newsObjectToBeUpdated }) => {
  const dispatch = useDispatch()
  const [isFormVisible, setFormVisibility] = useState(false)

  const [newTitle, setNewTitle] = useState(newsObjectToBeUpdated.title)
  const [newContent, setNewContent] = useState(newsObjectToBeUpdated.content)
  const [newURL, setNewURL] = useState(newsObjectToBeUpdated.url)

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const updatedNewsObject = {
    title: newTitle,
    content: newContent,
    url: newURL,
    date: newsObjectToBeUpdated.date,
    imageURL: newsObjectToBeUpdated.imageUrl,
    id: newsObjectToBeUpdated.id,
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }

  const updateNews = (event) => {
    event.preventDefault()
    updateThisNews(updatedNewsObject)
    toggleFormVisibility() // Close the form after submission
  }

  const updateThisNews = async (newsObject) => {
    try {
      const updatedNews = await newsService.update(newsObject.id, newsObject)
      dispatch(updateNewsobject(updatedNews))
      dispatch(
        setNotification(`Updated ${newsObject.title}`, 5, 'update')
      )
    } catch (exception) {
      dispatch(
        setNotification(
          'Something went wrong while trying to update news',
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
            <h2 className='text-center'>Update this news</h2>
            <form onSubmit={updateNews}>
              <div className='form-group'>
                <label>Title:</label>
                <input
                  className='form-control'
                  value={newTitle}
                  onChange={handleTitleChange}
                />
              </div>
              <div className='form-group'>
                <label>Content:</label>
                <input
                  className='form-control'
                  value={newContent}
                  onChange={handleContentChange}
                />
              </div>
              <div className='form-group'>
                <label>URL:</label>
                <input
                  className='form-control'
                  value={newURL}
                  onChange={handleURLChange}
                />
              </div>
              <Button
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
          Update News
        </Button>
      )}
    </div>
  )
}

UpdateNewsForm.propTypes = {
  newsObjectToBeUpdated: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default UpdateNewsForm
