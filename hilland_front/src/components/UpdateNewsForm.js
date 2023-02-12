import { useState } from 'react'
import newsService from '../services/news'
import { setNotification } from '../reducers/notificationReducer'
import store from '../store'

const updateThisNews = async (newsObject) => {
    try {
      await newsService.update(newsObject.id, newsObject)
      store.dispatch(
        setNotification(
          `Updated ${newsObject.title}`, 5, 'update'
        )
      )
    } catch (exception) {
      store.dispatch(
        setNotification(
          'something went wrong while trying to update news', 5, 'error'
        )
      )
    }
  } 
const UpdateNewsForm = ({  newsObjectToBeUpdated }) => {
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
        <button type='submit'>Update</button>
      </form>
    </div>
  )
}

export default UpdateNewsForm
