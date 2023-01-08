import { useState , useEffect } from 'react'
import newsService from './services/news'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewsForm from './components/NewsForm'
import Togglable from './components/Togglable'

const App = () => {
  const [news, setNews] = useState([])
  const [user, setUser] = useState('')

  useEffect(() => {
    newsService
      .getAll()
      .then(news => setNews( news.sort((a, b) => b.date.localeCompare(a.date) )))
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
    const thisnews =  news.filter(n => n.id.toString() === event.target.value.toString())[0]
    if (window.confirm(`Delete ${thisnews.title}?`)) {
      newsService
        .remove(event.target.value)
        .then(() => {
          alert(
            `Removed ${thisnews.title} from News `
          )
          setNews(news.filter(n => n.id.toString() !== event.target.value))
      })
    } 
  }
  
  const addNews = (newsObject) => {
    newsService
      .create(newsObject)
      .then(returnedNews=> {
        setNews(news.concat(returnedNews))
      })
      alert(`A news: ${newsObject.title}  added !!!`)
      .catch((error) => {
        error('something went wrong while trying to add a news', error.message)
      })
  }
  
  const NewsObject = ({ newsObject, removeNewsObject, updateNews}) => {
    const data = newsObject.image
    const Image = ({ data }) => <img src={`data:jpeg;base64,${data}`} alt = 'newsphoto'/>
    return (
      <ul >
        <li ><h3>{newsObject.title}</h3></li>
        <li> <Image data = {data} /> </li>
        <li>{newsObject.content}</li>
        <li>URL:{newsObject.url}</li>
        <button value = {newsObject.id} onClick={removeNewsObject}>
          delete 
        </button>
      </ul>
    )
  }
  
  return (
    <div>
      <h1>Hilland Demo</h1>
      <Togglable buttonLabel="Static pict">
      <img src="http://localhost:3001/testpict.jpg" alt = "testikuva"/>
      </Togglable>
      
      {user === '' ?
      <LoginForm handleSubmit={handleLogin} /> :
      <div>
      <p>{user.name} logged in</p>
      <Togglable buttonLabel="Add News">
        <NewsForm createNews={addNews}/>
      </Togglable>
      </div>
    }
      <h2>News</h2>
      <ul>
        {news.map(newsObject=> 
          <NewsObject key={newsObject.id} newsObject={newsObject} removeNewsObject = {removeNewsObject} />
        )}
      </ul>
    </div>
  )
}

export default App