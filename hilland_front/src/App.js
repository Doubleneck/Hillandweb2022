import { useState, useEffect, useReducer } from 'react'
import newsService from './services/news'
import loginService from './services/login'
import s3Service from './services/s3'
import LoginForm from './components/LoginForm'
import NewsForm from './components/NewsForm'
import NewsObject from './components/NewsObject'
import Togglable from './components/Togglable'

const App = () => {
  const [news, setNews] = useState([])
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [updateMessage, setUpdateMessage] = useState(null)
  const [reducervalue, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    newsService
      .getAll()
      .then((news) =>
        setNews(news.sort((a, b) => b.date.localeCompare(a.date)))
      )
  }, [reducervalue])

  function handleClick() {
    forceUpdate()
  }

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
      s3Service.setToken(user.token)
      setUser(user)
      console.log(user)
      console.log('logging in with', userObject.username, userObject.password)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = async (event) => {
    try {
      window.localStorage.setItem('loggedHillandappUser', '')
      newsService.setToken(null)
      s3Service.setToken(null)
      setUser('')
      console.log('logging out')
    } catch (exception) {
      setErrorMessage('logout failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeNewsObject = async (event) => {
    event.preventDefault()
    const newsObject = await news.filter(
      (n) => n.id.toString() === event.target.value.toString()
    )[0]
    const toBeRemovedFromS3Id = await { id: newsObject.imageURL.split('/')[3] }
    console.log('removeNwes', toBeRemovedFromS3Id)
    if (window.confirm(`Delete ${newsObject.title}?`)) {
      try {
        await newsService.remove(event.target.value)
        await s3Service.deleteFromS3(toBeRemovedFromS3Id)
        setUpdateMessage(`Removed ${newsObject.title} from News `)
        setNews(news.filter((n) => n.id.toString() !== event.target.value))
        setTimeout(() => {
          setUpdateMessage(null)
        }, 5000)
      } catch (exception) {
        setErrorMessage('something went wrong while trying to remove news')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const updateNewsObject = async (newsObject) => {
    try {
      await newsService.update(newsObject.id, newsObject)
      setUpdateMessage(`Updated ${newsObject.title} , please refresh!!`)
      setTimeout(() => {
        setUpdateMessage(null)
      }, 6000)
    } catch (exception) {
      setErrorMessage('something went wrong while trying to remove news')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addNews = async (newsObject) => {
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
      <button type='submit' onClick={handleLogout}>
        logout
      </button>
      <h1>Hilland Demo</h1>
      {user === '' ? (
        <LoginForm handleSubmit={handleLogin} />
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <SuccessNotification message={updateMessage} />
          <ErrorNotification message={errorMessage} />
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
            updateNewsObject={updateNewsObject}
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
  return <div className='update'>{message}</div>
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className='error'>{message}</div>
}
export default App
