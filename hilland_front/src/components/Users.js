import React, { useState, useEffect } from 'react'
import '../App.css'
import userService from '../services/users'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Notification from './Notification'
import { useSelector } from 'react-redux'
import UserForm from './UserForm.js'
import Button from 'react-bootstrap/Button'
function Users() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loginForm.user)
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState(null)
  const confirmUserDeletion = () => {
    return window.confirm('Are you sure you want to delete the user?')
  }

  useEffect(() => {
    userService.getAll().then((usr) => {
      setUsers(usr)
    })
  }, [newUser])

  const handleDelete = (id) => {

    if (!confirmUserDeletion()) {
      return // Cancel the user deletion
    }

    userService
      .remove(id)
      .then(() => {
        // Filter out the deleted users and update the state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== id)
        )
        dispatch(
          setNotification(
            'Removed successfully ', 5, 'update'
          )
        )
      })
      .catch((error) => {
        console.log(error)
        dispatch(
          setNotification(
            'Something went wrong while trying to remove the user', 5, 'error'
          )
        )
      })
  }
  const handleUserAdded = (user) => {
    setNewUser(user)
  }
  return (
    <div>
      <Notification />
      <UserForm onUserAdded={handleUserAdded} />
      <h1>Users:</h1>

      <br />
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <p>
              <strong>{u.username }  </strong> {' '}
              {user.role === 'admin' && (
                <Button data-cy="delete-button" variant="danger" onClick={() => handleDelete(u.id)}>
                Delete
                </Button>

              )}
              <> {u.role}</>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
