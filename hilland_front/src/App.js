import { useState , useEffect } from 'react'
import newsService from './services/news'

const App = (props) => {
  const [news, setNews] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newURL, setNewURL] = useState('')
  const [base64, setBase64] = useState("");

  useEffect(() => {
    newsService
      .getAll()
      .then(response => {
        setNews(response.data)
      })
  }, [])

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
    event.preventDefault()
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
      })
  }

  return (
    <div>
      <h1>Hilland Demo</h1>
      <h2>News</h2>
      <ul>
        {news.map(news=> 
          <News key={news.id} news={news} removeNews = {removeNews} />
        )}
      </ul>
      < NewsForm addNews={addNews} newURL = {newURL} newTitle = {newTitle} newContent = {newContent} 
      handleURLChange = {handleURLChange} handleTitleChange={handleTitleChange}
      handleContentChange = {handleContentChange} handlePhotoSelect ={handlePhotoSelect} />
    </div>
  )
}

const News = ({ news, removeNews}) => {
  const data = news.image
  const Image = ({ data }) => <img src={`data:jpeg;base64,${data}`} />
  
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


const NewsForm = (props) => {
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
}

export default App