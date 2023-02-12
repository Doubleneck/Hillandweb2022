import { useState, useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux'
import newsService from './services/news'
import loginService from './services/login'
import s3Service from './services/s3'
import LoginForm from './components/LoginForm'
import NewsForm from './components/NewsForm'
import NewsObject from './components/NewsObject'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { setNews } from './reducers/newsReducer'
import store from './store'

const App = () => {
  //const [news, setNews] = useState([])
  const news = useSelector((state) => state.news)
  const [user, setUser] = useState('')
  //const [reducervalue, forceUpdate] = useReducer((x) => x + 1, 0)

  
  useEffect(() => {
    newsService
      .getAll()
      .then((news) =>
      store.dispatch(setNews(news.sort((a, b) => b.date.localeCompare(a.date))))
      )
  }, [news])

 /*  function handleForce() {
    forceUpdate()
  }
 */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedHillandappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      newsService.setToken(user.token)
      s3Service.setToken(user.token)
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
      store.dispatch(
        setNotification(
          'wrong credentials', 3, 'error'
        )
      )
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
      store.dispatch(
        setNotification(
          'logout failed', 3, 'error'
        )
      )
    }
  }

 /*  const updateNewsObject = async (newsObject) => {
    try {
      await newsService.update(newsObject.id, newsObject)
      await forceUpdate()
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
  } */

  return (
    <div>
      <h1>Hilland Demo</h1>
      {user === '' ? (
        <> 
          <Notification />
          <LoginForm handleSubmit={handleLogin} />
        </>
      ) : (
        <div>
          <button type='submit' onClick={handleLogout}>
            logout
          </button>
          <p>{user.name} logged in</p>
          <Notification />
          <Togglable buttonLabel='Add News'>
            <NewsForm/>
          </Togglable>
        </div>
      )}
      <h2>News</h2>
      <ul>
        {news.map((newsObject) => (
          <NewsObject
            key={newsObject.id}
            newsObject={newsObject}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
