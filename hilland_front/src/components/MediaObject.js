import React from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import mediaService from '../services/media'
import '../App.css'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/esm/Button'

const MediaObject = ({ mediaObject, onMediaRemoved }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginForm.user)

  const handleDelete = () => {
    removeMediaObject(mediaObject)
  }

  const removeMediaObject = async (mediaObject) => {
    if (window.confirm(`Delete ${mediaObject.title}?`)) {
      try {
        await mediaService.remove(mediaObject.id)
        onMediaRemoved(mediaObject)
        dispatch(
          setNotification(`Removed ${mediaObject.title} from Media `, 5, 'update')
        )
      } catch (exception) {
        dispatch(
          setNotification(
            'Something went wrong while trying to remove media item',
            5,
            'error'
          )
        )
      }
    }
  }

  const handleDownload = () => {
    // Assuming mediaObject.imageURL contains the URL of the image
    const downloadLink = document.createElement('a')
    downloadLink.href = mediaObject.imageURL
    downloadLink.download = `${mediaObject.title}.jpg` // You can customize the filename here
    downloadLink.click()
  }

  return (
    <div>
      <ul className="gallery">
        <li>
          <h3 className = "text-center">{mediaObject.title}</h3>
        </li>
        <li>
          <img
            src={mediaObject.imageURL}
            alt="media item"
            className="img-fluid shadow-4 mx-auto d-block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </li>
        <p></p>

        {/* Download button */}
        <div className = "text-center">
          <Button
            data-cy="download-button"
            variant="primary"
            onClick={handleDownload}
          >
            Download image
            (or right-click and select &quot; Save image as...&quot;)
          </Button>
        </div>
        <p></p>
        {user.role === 'admin' && (
          <div>
            <Button
              data-cy="delete-button"
              variant="danger"
              value={mediaObject}
              onClick={handleDelete}
            >
              Delete
            </Button>{' '}
          </div>
        )}
      </ul>
    </div>
  )
}

MediaObject.propTypes = {
  mediaObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
  }).isRequired,
  onMediaRemoved: PropTypes.func.isRequired,
}

export default MediaObject
