
import React from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import releaseService from '../services/releases'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/esm/Button'
import '../App.css'

const ReleaseObject = ({ releaseObject, onReleaseRemoved }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginForm.user)
  const handleDelete = () => {
    removeReleaseObject(releaseObject)
  }

  const removeReleaseObject = async (releaseObject) => {

    if (window.confirm(`Delete ${releaseObject.title}?`)) {
      try {
        await releaseService.remove(releaseObject.id)
        onReleaseRemoved(releaseObject)
        dispatch(
          setNotification(
            `Removed ${releaseObject.title} from releases `, 5, 'update'
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
          <h3 >{releaseObject.title}</h3>
        </li>
        <li>
          {' '}
          <img  src={releaseObject.imageURL} alt='news' className='img-fluid shadow-4 mx-auto d-block' style={{ maxWidth: '100%', height: 'auto' }}/>{' '}
        </li>
        <p></p>
        <li >{releaseObject.content}</li>
        <p></p>

        <li className="mx-auto">
          {releaseObject.buyLink !== '' && (
            <>
              <Button variant="success" href={'https://' + releaseObject.buyLink} target="_blank">
        Buy
              </Button> {' '}
            </>
          )}
          {releaseObject.listenLink !== '' && (
            <>
              <Button variant="info" href={'https://' + releaseObject.listenLink} target="_blank">
        Listen
              </Button>
            </>
          )}
          <p></p>
          <p></p>
        </li>
        {user.role === 'admin' && (
          <div>
            <Button data-cy="delete-button" variant="danger" value={releaseObject} onClick={handleDelete}>
              delete
            </Button>
          </div>
        )}
      </ul>
    </div>
  )
}
ReleaseObject.propTypes = {
  releaseObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    content: PropTypes.string,
    year: PropTypes.number.isRequired,
    buyLink: PropTypes.string,
    listenLink: PropTypes.string,
  }).isRequired,
  onReleaseRemoved: PropTypes.func.isRequired,
}

export default ReleaseObject