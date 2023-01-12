import { useState } from 'react'

const NewsForm = ({ createNews }) => {
  const current = new Date()
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newURL, setNewURL] = useState('')
  const [imageFile, setImageFile] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setNewContent(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const handlePhotoSelect = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const MAX_FILE_SIZE = 1000
    if (file.size / 1000 < MAX_FILE_SIZE) {
      setImageFile(file)
    } else {
      alert('Kuvan maksimikoko on 1M')
    }
  }
  const newsObject = {
    title: newTitle,
    content: newContent,
    url: newURL,
    date: date,
    imageFile: imageFile,
  }
  const addNews = (event) => {
    event.preventDefault()
    createNews(newsObject)
    setNewTitle('')
    setNewContent('')
    setNewURL('')
    setImageFile('')
  }
  return (
    <div>
      <h2>Add news: </h2>
      <form onSubmit={addNews}>
        <div>
          title: <input size="50" value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          content: <input size="50" value={newContent} onChange={handleContentChange} />
        </div>
        <div>
          url: <input value={newURL} onChange={handleURLChange} />
        </div>
        <br />
        <div>
          file:
          <input type='file' accept='image/*' onChange={handlePhotoSelect} />
        </div>
        <button type='submit'>Upload</button>
      </form>
    </div>
  )
}

export default NewsForm
