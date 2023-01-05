import { useState , useEffect } from 'react'
import newsService from './services/news'
import loginService from './services/login'

const App = (props) => {
  const [news, setNews] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newURL, setNewURL] = useState('')
  const [base64, setBase64] = useState("")
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState('')

  useEffect(() => {
    newsService
      .getAll()
      .then(news => setNews( news.sort((a, b) => b.date.localeCompare(a.date) )))
  }, [news])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedHillandappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      newsService.setToken(user.token)
    }
  }, [])
  
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedHillandappUser', JSON.stringify(user)
      ) 
      //console.log('user', user.token)
      newsService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      
      alert('wrong credentials')
      /* setTimeout(() => {
        setErrorMessage(null)
      }, 5000) */
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleURLChange = (event) => {
    
    setNewURL(event.target.value)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result.split(',')[1]);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0]
    const MAX_FILE_SIZE = 1000 // 300kB
    if (file.name.split('.')[1]==="jpg" && file.size/1000 < MAX_FILE_SIZE ){
      let base64 = await convertBase64(file)
      //console.log(base64)
      setBase64(base64)
    } else {
      alert("Kuvan maksimikoko on 1M ja sen pitää olla jpg")
    }
  }

  const removeNews = (event) => {
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
  const addNews = (event) => {
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

    const newsObject = {
      title: newTitle,
      content: newContent,
      url: newURL,
      date: date,
      image: base64
    }
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
/*   const addNews = async (event) => {
    event.preventDefault()
    const current = await new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

    const newsObject = await{
      title: newTitle,
      content: newContent,
      url: newURL,
      date: date,
      image: base64
    }
    const response = await newsService.create(newsObject)
    await alert ('created a news!')
    //await news.concat(response.data)
    await setNews(news.concat(response.data))
    setNewTitle('')
        setNewContent('')
        setNewURL('')
      } */

  /*   newsService
      .create(newsObject)
      .then(response => {
        setNews(news.concat(response.data))
        setNewTitle('')
        setNewContent('')
        setNewURL('')
        //setBase64('')
        //console.log("Axios async",response.data)
      })
      .catch(error => {
        alert(
          `Can´t get news`
        )
      }) */
  
  const News = ({ news, removeNews}) => {
    const data = news.image
    const Image = ({ data }) => <img src={`data:jpeg;base64,${data}`} alt = 'alt description'/>
    
    return (
      <ul >
        <li ><h3>{news.title}</h3></li>
        <li> <Image data = {data} /> </li>
        <li>{news.content}</li>
        <li>URL:{news.url}</li>
        <button value = {news.id} onClick={removeNews}>
          delete 
        </button>
      </ul>
    )
  }
  const loginForm = () => (
    <div>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>   
    </div>   
  )

  const newsForm = () => {
    return(
      <div>
       <h2>Add news: </h2>
       <form onSubmit={addNews}>
          <div> title: <input value={newTitle} onChange={handleTitleChange}/></div>
          <div> content: <input value={newContent} onChange={handleContentChange}/></div> 
          <div> url: <input value={newURL} onChange={handleURLChange}/></div> 
          <br />
          <div> file: <input type="file" onChange={handlePhotoSelect}/></div>
          <button type="submit">add</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      
      <h1>Hilland Demo</h1>
      
      {user === '' ?
      loginForm() :
      <div>
        <p>{user.name} logged in</p>
        {newsForm()}
      </div>
    }
      
      <h2>News</h2>
      <ul>
        {news.map(news=> 
          <News key={news.id} news={news} removeNews = {removeNews} />
        )}
      </ul>
     
    </div>
  )
}

/* const News = ({ news, removeNews}) => {
  const data = news.image
  const Image = ({ data }) => <img src={`data:jpeg;base64,${data}`} alt = 'alt description'/>
  
  return (
    <ul >
      <li ><h3>{news.title}</h3></li>
      <li> <Image data = {data} /> </li>
      <li>{news.content}</li>
      <li>URL:{news.url}</li>
      <button value = {news.id} onClick={removeNews}>
        delete 
      </button>
    </ul>
  )
} */


/* const NewsForm = (props) => {
  return(
    <div>
     <form onSubmit={props.addNews}>
        <div> title: <input value={props.newTitle} onChange={props.handleTitleChange}/></div>
        <div> content: <input value={props.newContent} onChange={props.handleContentChange}/></div> 
        <div> url: <input value={props.newURL} onChange={props.handleURLChange}/></div> 
        <br />
        <div> file: <input type="file" value={props.newFile} onChange={props.handlePhotoSelect}/></div>
        <button type="submit">add</button>
      </form>
    </div>
  )
} */

/* const loginForm = () => (
  <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>      
) */

export default App