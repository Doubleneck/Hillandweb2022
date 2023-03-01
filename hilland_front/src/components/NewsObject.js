import Togglable from '../components/Togglable'
import UpdateNewsForm from '../components/UpdateNewsForm'
import Notification from '../components/Notification'
import { setNotification } from '../reducers/notificationReducer'
import store from '../store'
import newsService from '../services/news'
import s3Service from '../services/s3'
import { removeNewsobject } from '../reducers/newsReducer'
import { useSelector } from 'react-redux'
import '../App.css'
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
  const user = useSelector((state) => state.loginForm.user)
  const handleDelete = () => {
    removeNewsObject(newsObject)
  }

  return (
    <div>
    <ul className='gallery'>
      <li>
        <h3 className="text-center">{newsObject.title}</h3>
      </li>
      <li>
        {' '}
        <img  src={newsObject.imageURL} className='img-fluid shadow-4' />{' '}
      </li>
      <li className="text-center">{newsObject.content}</li>
      <li className="text-center">
      <a href={'https://' + newsObject.url}>{newsObject.url}</a>
      <p></p>
      <p></p>
      </li>
      {user === '' ? (


        <> 
        </>
      ) : (
        <div>
          <Notification />
            <button value={newsObject} onClick={handleDelete}>
              delete
            </button>
          <Togglable buttonLabel='Update'>
            <UpdateNewsForm
              newsObjectToBeUpdated={newsObject}
            />
          </Togglable>
        </div>
      )}
    </ul>
    </div>  
  )
}
export default NewsObject
