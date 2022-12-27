import { useState , useEffect } from 'react'
import axios from 'axios'
//import base64 from 'react-native-base64'
import encode  from 'base-64'

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
  const [newFile, setNewFile] = useState(null);
  const [newFilename, setNewFilename] = useState('Choose File');
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
    console.log("newfile", newFile)
    console.log("newfilename",newFilename)
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handlePhotoSelect = (e) => {
    setNewFile(e.target.files[0])
    setNewFilename(e.target.files[0].name)
  }

  
  const addNews = (event) => {
    event.preventDefault()
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
    console.log("addNews")

    function previewFile() {
      const file = newFile
      //console.log("file",file)
      const reader = new FileReader();
    
      reader.addEventListener("load", async () => {
       function toBinary(string) {
        const codeUnits = Uint16Array.from(
          { length: string.length },
          (element, index) => string.charCodeAt(index)
        );
        const charCodes = new Uint8Array(codeUnits.buffer);
      
        let result = "";
        charCodes.forEach((char) => {
          result += String.fromCharCode(char);
        });
        return result;
      }
       //setBase64(btoa(unescape(encodeURIComponent(reader.result))))
       const converted = await toBinary(reader.result)
       //console.log("converted to bin:", converted)
       const my = await btoa(unescape(converted))
       //console.log(my)
       //console.log("converted to btoa:", my)
       await setBase64(my)
       //console.log(base64)
       //const encodedstring = Buffer.from(reader.result).toString('base64')
   
      }, false);
      if (file) {
        console.log("onfilee")
        reader.readAsText(file);
      }
    }
    previewFile() 
    
    const newsObject = {
      title: newTitle,
      content: newContent,
      date: date,
      picture: base64 //newFile//newFile//pictAsBase64
    }
  
    const getData = async () => {
      try {
      const response = await axios.post('http://localhost:3001/news', newsObject)
      setNews(news.concat(response.data))
      setNewTitle('')
      setNewContent('')
      setNewFile(null)
      setNewFilename('Choose File')
      console.log("Axios async",response.data)
      }
      catch (e) {
        console.log("problem")

      }
    };
    getData()
  /*   axios
      .post('http://localhost:3001/news', newsObject)
      .then(response => {
        setNews(news.concat(response.data))
        setNewTitle('')
        setNewContent('')
        setNewFile(null)
        setNewFilename('Choose File')
        console.log(response)
      }) */
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