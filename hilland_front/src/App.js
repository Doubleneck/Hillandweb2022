import { useState, useEffect } from 'react'
import newsService from './services/news'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewsForm from './components/NewsForm'
import NewsObject from './components/NewsObject'
import Togglable from './components/Togglable'

const App = () => {
  const [news, setNews] = useState([])
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [updateMessage, setUpdateMessage] = useState(null)

  useEffect(() => {
    newsService
      .getAll()
      .then((news) =>
        setNews(news.sort((a, b) => b.date.localeCompare(a.date)))
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedHillandappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      newsService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedHillandappUser', JSON.stringify(user))
      newsService.setToken(user.token)
      setUser(user)
      console.log('logging in with', userObject.username, userObject.password)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeNewsObject = async (event) => {
    event.preventDefault()
    const newsObject = news.filter(
      (n) => n.id.toString() === event.target.value.toString()
      )[0]
    
    if (window.confirm(`Delete ${newsObject.title}?`)) {
      try {
          const response = await newsService.remove(event.target.value)
          setUpdateMessage(`Removed ${newsObject.title} from News `)
          setTimeout(() => {
            setUpdateMessage(null)
          }, 5000)
          setNews(news.filter((n) => n.id.toString() !== event.target.value))
      } catch (exception) {
      setErrorMessage('something went wrong while trying to remove news')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }}
  /* const removeNewsObject = (event) => {
    event.preventDefault()
    try {
      const newsObject = news.filter(
        (n) => n.id.toString() === event.target.value.toString()
        )[0]
    if (window.confirm(`Delete ${newsObject.title}?`)) {
      newsService.remove(event.target.value).then(() => {
        setUpdateMessage(`Removed ${newsObject.title} from News `)
        setTimeout(() => {
          setUpdateMessage(null)
        }, 5000)
        setNews(news.filter((n) => n.id.toString() !== event.target.value))
      })
    }
    } catch (exception) {
      setErrorMessage('something went wrong while trying to remove news')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    }
  } */

  const addNews = async (newsObject) => {
    console.log('addNewssissä', newsObject.imageFile.size)
    const file = newsObject.imageFile
    try {
      const { url } = await fetch('http://localhost:3001/api/s3url').then(
        (res) => res.json()
      )
      console.log('url', url)
      console.log('addNewssissä koko ennen fetchiä:', newsObject.imageFile.size)
      await fetch(url, {
        method: 'put',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file,
      })
      const imageUrl = await url.split('?')[0]
      console.log('imageurl, AddNews frontissa:', imageUrl)
      const newsDataObject = {
        title: newsObject.title,
        content: newsObject.content,
        url: newsObject.URL,
        date: newsObject.date,
        imageURL: imageUrl,
      }
      const returnedNews = await newsService.create(newsDataObject)
      setNews(
        news.concat(returnedNews).sort((a, b) => b.date.localeCompare(a.date))
      )
      setUpdateMessage(`A news: ${newsObject.title}  added !!!`)
      setTimeout(() => {
        setUpdateMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('something went wrong while trying to create news')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      
      <h1>Hilland Demo</h1>
      {user === '' ? (
        <LoginForm handleSubmit={handleLogin} />
      ) : (
        <div>
          <p>{user.name} logged in</p>
          < SuccessNotification message = {updateMessage} />
          < ErrorNotification message = {errorMessage} />
          <Togglable buttonLabel='Add News'>
            <NewsForm createNews={addNews} />
          </Togglable>
        </div>
      )}
      <h2>News</h2>

      <ul>
        {news.map((newsObject) => (
          <NewsObject
            key={newsObject.id}
            newsObject={newsObject}
            removeNewsObject={removeNewsObject}
          />
        ))}
      </ul>
    </div>
  )
}
const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="update">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}
export default App
