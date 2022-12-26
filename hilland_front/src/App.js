import { useState , useEffect } from 'react'
import axios from 'axios'

const News = ({ news }) => {
 
  const data = news.picture 
  if (!data===undefined){
    const Example = ({ data }) => <img src={`data:jpeg;base64,${data}`} />
  }
  return (
    <ul >
      <li ><h3>{news.title}</h3></li>
      DATAA <b>{data ? 'on' : 'ei'}</b> 
     
 
      <li><b>{data===undefined ? 'on' : 'ei'}</b> </li>
      <li>{news.content}</li>
    </ul>
  )
}

const App = (props) => {
  const [news, setNews] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('Choose File');

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/news')
      .then(response => {
       // console.log('promise fulfilled')
        setNews(response.data)
      })
  }, [])

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  
  const handlePhotoSelect = (evt) => {
    if (!evt.target.files[0]===undefined){
      setFile(evt.target.files[0])
    
      setFilename(evt.target.files[0].name)
    }
  }

  const addNews = (event) => {
    event.preventDefault()
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
    let reader = new FileReader();
    // Convert the file to base64 text

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const pictAsBase64 =  convertToBase64(file)
    console.log(pictAsBase64)
    const newsObject = {
      title: newTitle,
      content: newContent,
      date: date,
      picture: pictAsBase64
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
      handleContentChange = {handleContentChange} handlePhotoSelect ={handlePhotoSelect}/>
    </div>
  )
}

const NewsForm = (props) => {
  return(
    <div>
     <form onSubmit={props.addNews}>
        <div> title: <input value={props.newTitle} onChange={props.handleTitleChange}/></div>
        <div> content: <input value={props.newContent} onChange={props.handleContentChange}/></div> 
        <br />
        <input type="file" onChange={props.handlePhotoSelect} />
        <button type="submit">add</button>
      </form>
    </div>
  )
}



export default App