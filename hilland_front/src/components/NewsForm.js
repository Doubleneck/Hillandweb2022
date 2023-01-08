import { useState } from 'react' 

const NewsForm = ({ createNews }) => {
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [newURL, setNewURL] = useState('')
    const [base64, setBase64] = useState("")

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
    const newsObject = {
      title: newTitle,
      content: newContent,
      url: newURL,
      date: date,
      image: base64
    }
    const addNews = (event) => {
        event.preventDefault()
        createNews(newsObject)
        setNewTitle('')
        setNewContent('')
        setNewURL('')
        setBase64('')
      }
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
)}

export default NewsForm