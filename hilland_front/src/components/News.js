import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import newsService from '../services/news'
import s3Service from '../services/s3'
import NewsForm from '../components/NewsForm'
import NewsObject from '../components/NewsObject'
import Togglable from '../components/Togglable'
import Notification from '../components/Notification'
import { setNotification } from '../reducers/notificationReducer'
import { setNews } from '../reducers/newsReducer'
import {
  setUser,
} from '../reducers/loginFormReducer'

const News = () => {
  const news = useSelector((state) => state.news)
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()

  useEffect(() => {
    newsService
      .getAll()
      .then((news) =>
       dispatch(setNews(news.sort((a, b) => b.date.localeCompare(a.date))))
      )
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedHillandappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      newsService.setToken(user.token)
      s3Service.setToken(user.token)
    }
  }, [dispatch])

/*   useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedHillandappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(user.token)
      const expiresAtMillis = decodedToken.exp * 1000
      //console.log('Datenow', Date.now())
      //console.log('expiresAtMillis', expiresAtMillis)
      
      if (expiresAtMillis < Date.now()) {
        window.localStorage.setItem('loggedHillandappUser', '')
        store.dispatch(setUser(''))
        newsService.setToken(null)
        s3Service.setToken(null)
        console.log('logout', user)
        store.dispatch(
          setNotification(
            'Automaticly logged out', 3, 'error'
          )
        )  
      } 
    }
  }) */

  const handleLogout = async (event) => {
    try {
    event.preventDefault()
    window.localStorage.setItem('loggedHillandappUser', '')
    dispatch(setUser(''))
    newsService.setToken(null)
    s3Service.setToken(null)
    console.log('logout', user)
  }catch (exception) {
    dispatch(
      setNotification(
        'logout failed', 3, 'error'
      )
    )
  }
}
  return (
   
    <div>
      {user === '' ? (
        <> 
        </>
      ) : (
        <div>
          <button type='submit' onClick={handleLogout}>
            logout
          </button>
          <Notification />
          <Togglable buttonLabel='Add News'>
            <NewsForm/>
          </Togglable>
        </div>
      )}
      <p></p>
      <h1 className="text-center" >News:</h1>
      <p></p>
      <ul className="gallerynogrid" >
       
        {news.map((newsObject) => (
        <div >
          <NewsObject 
            key={newsObject.id}
            newsObject={newsObject}
          />
         </div>
        ))}
      </ul>
    </div>
  
  )
}

export default News
