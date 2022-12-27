import { useState , useEffect } from 'react'
import axios from 'axios'

const News = ({ news }) => {
  const data = news.picture 
  const Example = ({ data }) => <img src={`data:jpeg;base64,${data}`} />
  
  return (
    <ul >
      <li ><h3>{news.title}</h3></li>
      DATAA <b>{data ? 'on' : 'ei'}</b> 
 
      <li><b>{data===undefined ? 'on' : 'ei'}</b> </li>
      <li> <Example data = {data} /> </li>
      <li>{news.content}</li>
    </ul>
  )
}

const App = (props) => {
  const [news, setNews] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [base64, setBase64] = useState("");

  useEffect(() => {
    //console.log('effect')
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
    let base64 = await convertBase64(file)
    console.log(base64)
    setBase64(base64)
  }

  const addNews = (event) => {
    event.preventDefault()
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
    console.log("addNews")
    console.log(base64)
    
    const newsObject = {
      title: newTitle,
      content: newContent,
      date: date,
      picture: base64 
    }
  
    const getData = async () => {
      try {
      const response = await axios.post('http://localhost:3001/news', newsObject)
      setNews(news.concat(response.data))
      setNewTitle('')
      setNewContent('')
      setBase64('')
      console.log("Axios async",response.data)
      }
      catch (e) {
        console.log("problem")
      }
    };
    getData()

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
      handleContentChange = {handleContentChange} handlePhotoSelect ={handlePhotoSelect} />
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
        <div> file: <input type="file" value={props.newFile} onChange={props.handlePhotoSelect}/></div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default App