
import React from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { removeNewsobject } from '../reducers/newsReducer'
import { useDispatch, useSelector } from 'react-redux'
import newsService from '../services/news'
import UpdateNewsForm from './UpdateNewsForm'
import '../App.css'
import PropTypes from 'prop-types'

import Button from 'react-bootstrap/esm/Button'

const NewsObject = ({ newsObject }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginForm.user)
  const handleDelete = () => {
    removeNewsObject(newsObject)
  }

  const removeNewsObject = async (newsObject) => {

    if (window.confirm(`Delete ${newsObject.title}?`)) {
      try {
        await newsService.remove(newsObject.id)
        dispatch(removeNewsobject(newsObject.id))
        dispatch(
          setNotification(
            `Removed ${newsObject.title} from News `, 5, 'update'
          )
        )
      } catch (exception) {
        dispatch(
          setNotification(
            'something went wrong while trying to remove news', 5, 'error'
          )
        )
      }
    }
  }

  return (
    <div >
      <ul className='mx-auto' >
        <li>
          <h3 className="text-center">{newsObject.title}</h3>
        </li>
        <li>
          {' '}
          <img  src={newsObject.imageURL} alt='news' className='img-fluid shadow-4' style={{ maxWidth: '100%', height: 'auto' }}/>{' '}
        </li>
        <p></p>
        <li className="mx-auto">{newsObject.content}</li>
        <p></p>
        <li className="mx-auto">
          <Button variant="secondary" href={'https://' + newsObject.url} target="_blank">
        More info
          </Button>
          <p></p>
          <p></p>
        </li>
        {user === '' ? (
          <>
          </>
        ) : (
          <div>
            <Button data-cy="delete-button" variant="danger" value={newsObject} onClick={handleDelete}>
              delete
            </Button>
            <UpdateNewsForm
              newsObjectToBeUpdated={newsObject}
            />
          </div>
        )}
      </ul>
    </div>
  )
}
NewsObject.propTypes = {
  newsObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}
export default NewsObject
