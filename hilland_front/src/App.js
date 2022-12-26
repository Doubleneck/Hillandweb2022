import { useState , useEffect } from 'react'
import axios from 'axios'

const News = ({ news }) => {
  // Base64 string data
const data = news.picture
const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />

//ReactDOM.render(<Example data={data} />, document.getElementById('container'))
  return (
    <ul >
      <li ><h3>{news.title}</h3></li>
      <li><Example data={data} /></li>
      <li>{news.content}</li>
    </ul>
  )
}

const App = (props) => {
  const [news, setNews] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/news')
      .then(response => {
        console.log('promise fulfilled')
        setNews(response.data)
      })
  }, [])

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

 
  const addNews = (event) => {
    event.preventDefault()
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
    const newsObject = {
      title: newTitle,
      content: newContent,
      date: date,
      picture: ""
    }
    axios
      .post('http://localhost:3001/news', newsObject)
      .then(response => {
        setNews(news.concat(response.data))
        setNewTitle('')
        setNewContent('')
        console.log(response)
      })
    console.log('button clicked', newsObject)
  }

  return (
    <div>
      <h1>Hilland Demo</h1>
      <h2>News</h2>
      <ul>
        {news.map(news=> 
          <News key={news.id} news={news} />
        )}
      </ul>
      < NewsForm addNews={addNews} newTitle = {newTitle} newContent = {newContent} handleTitleChange={handleTitleChange}
      handleContentChange = {handleContentChange}/>
    </div>
  )
}

const NewsForm = (props) => {
  return(
    <div>
     <form onSubmit={props.addNews}>
        <div> title: <input value={props.newTitle} onChange={props.handleTitleChange}/></div>
        <div> content: <input value={props.newContent} onChange={props.handleContentChange}/></div> 
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default App