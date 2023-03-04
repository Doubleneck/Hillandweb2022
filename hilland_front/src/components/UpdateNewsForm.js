import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import newsService from '../services/news'
import Button from 'react-bootstrap/esm/Button'

const UpdateNewsForm = ({  newsObjectToBeUpdated }) => {
  const dispatch = useDispatch()
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

   const updateNews = (event) => {
    event.preventDefault()
    updateThisNews(updatedNewsObject)
  } 

  const updateThisNews = async (newsObject) => {
    try {
      await newsService.update(newsObject.id, newsObject)
      dispatch(
        setNotification(
          `Updated ${newsObject.title}, please refresh`, 5, 'update'
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          'something went wrong while trying to update news', 5, 'error'
        )
      )
    }
  } 
  return (
    <div>
      <h2>Update this news: </h2>
      <form onSubmit={updateNews}>
        <div>
          title:{' '}
          <input value={newTitle} size='50' onChange={handleTitleChange} />
        </div>
        <div>
          content:{' '}
          <input value={newContent} size='50' onChange={handleContentChange} />
        </div>
        <div>
          url: <input value={newURL} size='50' onChange={handleURLChange} />
        </div>
        <br />
        <Button variant='success' type='submit'>Update</Button>
      </form>
    </div>
  )
}

export default UpdateNewsForm
