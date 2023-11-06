import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { appendNewsobject } from '../reducers/newsReducer'
import newsService from '../services/news'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const NewsForm = () => {
  const dispatch = useDispatch()
  const [isFormVisible, setFormVisibility] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newURL, setNewURL] = useState('')
  const [imageFile, setImageFile] = useState('')

  const current = new Date()
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
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

  const newsObject = {
    title: newTitle,
    content: newContent,
    url: newURL,
    date: date,
    imageFile: imageFile,
  }

  const addNews = (event) => {
    event.preventDefault()
    createNews(newsObject)
    setNewTitle('')
    setNewContent('')
    setNewURL('')
    setImageFile('')
    toggleFormVisibility()
  }

  const createNews = async (newsObject) => {

    try {
      const newNewsObject = await newsService.create(newsObject)
      dispatch(appendNewsobject(newNewsObject))
      dispatch(
        setNotification(`A news: ${newsObject.title} added!`, 5, 'update')
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
            <h2 className="my-4 text-center">Add News</h2>
            <form onSubmit={addNews}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  className="form-control"
                  value={newTitle}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newContent}
                  onChange={handleContentChange}
                />
              </div>
              <div className="form-group">
                <label>URL:</label>
                <input
                  className="form-control"
                  value={newURL}
                  onChange={handleURLChange}
                />
              </div>
              <div className="form-group">
                <label>File:</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />
              </div>
              <Button variant="success" type="submit" className="my-2">
                Create News
              </Button>
              <Button variant="primary" onClick={toggleFormVisibility}>
          Close form
              </Button>
            </form>
          </Card.Body>
        </Card>
      ) : (
        <Button variant="primary" onClick={toggleFormVisibility}>
          Add News
        </Button>
      )}
    </div>

  )
}

export default NewsForm


