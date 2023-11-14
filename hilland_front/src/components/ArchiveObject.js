
import React from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import archiveService from '../services/archives'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/esm/Button'
import '../App.css'

const ArchiveObject = ({  archiveObject,onArchiveRemoved }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginForm.user)
  const handleDelete = () => {
    removeArchiveObject(archiveObject)
  }

  const removeArchiveObject = async (archiveObject) => {

    if (window.confirm(`Delete ${archiveObject.title}?`)) {
      try {
        await archiveService.remove(archiveObject.id)
        onArchiveRemoved(archiveObject)
        dispatch(
          setNotification(
            `Removed ${archiveObject.title} from Archives `, 5, 'update'
          )
        )
      } catch (exception) {
        dispatch(
          setNotification(
            'something went wrong while trying to remove archive item', 5, 'error'
          )
        )
      }
    }
  }

  return (
    <div  >
      <ul className="gallery">
        <li>
          <h3 >{archiveObject.title}</h3>
        </li>
        <li>
          {' '}
          <img  src={archiveObject.imageURL} alt='news' className='img-fluid shadow-4 mx-auto d-block' style={{ maxWidth: '100%', height: 'auto' }}/>{' '}
        </li>
        <p></p>
        <li >{archiveObject.content}</li>
        <p></p>
        {user.role === 'admin' && (
          <div>
            <Button data-cy="delete-button" variant="danger" value={archiveObject} onClick={handleDelete}>
              delete
            </Button>
          </div>
        )}
      </ul>
    </div>
  )
}
ArchiveObject.propTypes = {
  archiveObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onArchiveRemoved: PropTypes.func.isRequired,
}

export default ArchiveObject
