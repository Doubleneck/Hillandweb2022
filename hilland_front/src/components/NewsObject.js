import Togglable from '../components/Togglable'
import UpdateNewsForm from '../components/UpdateNewsForm'
const NewsObject = ({ newsObject, removeNewsObject, updateNewsObject }) => {
  return (
    <ul>
      <li>
        <h3>{newsObject.title}</h3>
      </li>
      <li>
        {' '}
        <img src={newsObject.imageURL} />{' '}
      </li>
      <li>{newsObject.content}</li>
      <li>URL:{newsObject.url}</li>
      <button value={newsObject.id} onClick={removeNewsObject}>
        delete
      </button>
      <Togglable buttonLabel='Update'>
            <UpdateNewsForm updateThisNews = {updateNewsObject} newsObjectToBeUpdated={newsObject}/>
      </Togglable>
     
    </ul>
  )
}
export default NewsObject
