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
      alert('wrong credentials')
    }
  }

  const removeNewsObject = (event) => {
    event.preventDefault()
    const thisnews = news.filter(
      (n) => n.id.toString() === event.target.value.toString()
    )[0]
    if (window.confirm(`Delete ${thisnews.title}?`)) {
      newsService.remove(event.target.value).then(() => {
        alert(`Removed ${thisnews.title} from News `)
        setNews(news.filter((n) => n.id.toString() !== event.target.value))
      })
    }
  }

  const addNews = async (newsObject) => {
    console.log('addNewssissä', newsObject.imageFile.size)
    const file = newsObject.imageFile
    try {
      const { url } = await fetch('http://localhost:3001/s3Url').then((res) =>
        res.json()
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
      alert(`A news: ${newsObject.title}  added !!!`)
    } catch (exception) {
      alert('something went wrong while trying to create news')
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

export default App
