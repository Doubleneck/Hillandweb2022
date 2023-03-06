import { useState } from 'react'
//import { appendNewsobject } from '../reducers/newsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import s3Service from '../services/s3'
import newsService from '../services/news'
import Button from 'react-bootstrap/Button'
import { setNews } from '../reducers/newsReducer'
const NewsForm = () => {

  const dispatch = useDispatch()
  const current = new Date()
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newURL, setNewURL] = useState('')
  const [imageFile, setImageFile] = useState('')

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
  }
  const createNews = async (newsObject) => {
    const file = newsObject.imageFile
    
    try {
      const imageUrl = await s3Service.sendToS3(file)
  
      const newsDataObject = {
        title: newsObject.title,
        content: newsObject.content,
        url: newsObject.url,
        date: newsObject.date,
        imageURL: imageUrl,
      }
      await newsService.create(newsDataObject)
      newsService
      .getAll()
      .then((news) =>
       dispatch(setNews(news.sort((a, b) => b.date.localeCompare(a.date))))
      ) 
      dispatch(
        setNotification(
          `A news: ${newsObject.title}  added !!!`, 5, 'update'
        )
      )
    } catch (error) {
      console.log(error.response.data.error)
      dispatch(
        setNotification(
          error.response.data.error, 5, 'error'
        )
      )
    }
  } 
  return (

    <div className='text-center'>
      <h2>Add news: </h2>
      
      <form onSubmit={addNews}>
        <div>
          title: <input size="50" value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>    
        content: <input size='50' rows='2' value={newContent} onChange={handleContentChange} />
        </div>
        <div>
          url: <input size='50' value={newURL} onChange={handleURLChange} />
        </div>
        <br />
        <div>
          file:
          <input type='file' accept='image/*' onChange={handlePhotoSelect} />
        </div>
        <Button variant='success' type='submit'>Create news</Button>
      </form>
    </div>
  )
}

export default NewsForm
