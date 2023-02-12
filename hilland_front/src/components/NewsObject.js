import Togglable from '../components/Togglable'
import UpdateNewsForm from '../components/UpdateNewsForm'
import Notification from '../components/Notification'
import { setNotification } from '../reducers/notificationReducer'
import store from '../store'
import newsService from '../services/news'
import s3Service from '../services/s3'
import { removeNewsobject } from '../reducers/newsReducer'

const removeNewsObject = async (newsObject) => {
  const toBeRemovedS3Id = await { id: newsObject.imageURL.split('/')[3] }

  if (window.confirm(`Delete ${newsObject.title}?`)) {
    try {
      await newsService.remove(newsObject.id)
      store.dispatch(removeNewsobject(newsObject.id))
      store.dispatch(
        setNotification(
          `Removed ${newsObject.title} from News `, 5, 'update'
        )
      )

      await s3Service.deleteFromS3(toBeRemovedS3Id)
    } catch (exception) {
      store.dispatch(
        setNotification(
          'something went wrong while trying to remove news', 5, 'error'
        )
      )
    }
  }
} 

const NewsObject = ({ newsObject }) => {
  const handleDelete = () => {
    removeNewsObject(newsObject)
  }
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
      <Notification />
      <button value={newsObject} onClick={handleDelete}>
        delete
      </button>
      <Togglable buttonLabel='Update'>
      <UpdateNewsForm
         newsObjectToBeUpdated={newsObject}
      />
      </Togglable>
    </ul>
  )
}
export default NewsObject
