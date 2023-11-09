import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import userService from '../services/users'
import PropTypes from 'prop-types'
const UserForm = ({ onUserAdded }) => {
  const [isFormVisible, setFormVisibility] = useState(false)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('user')
  const dispatch = useDispatch()

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }
  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  const toggleFormVisibility = () => {
    setFormVisibility(!isFormVisible)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      dispatch(setNotification('Passwords do not match', 3, 'error')
      )
    } else {
      // Passwords match, you can proceed with form submission.
      try {
        const User = {
          username,
          name,
          role,
          password
        }

        if (role === 'admin') {
          // Show a confirmation alert when creating an admin user
          const confirmAdminCreation = window.confirm('Are you sure you want to create an admin user?')
          if (!confirmAdminCreation) {
            return // Cancel the user creation
          }
        }
        await userService.create(User)
        setName('')
        setUsername('')
        toggleFormVisibility()
        onUserAdded(User)
        dispatch(setNotification('Thank you!!', 2, 'update'))
      } catch (error) {
        dispatch(setNotification(error.response.data.error, 5, 'error'))
      }
    }
  }

  return (
    <div className="text-center" data-cy="add_user">
      {isFormVisible ? (
        <Container >

          <h2>User Registration</h2>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Col xs={12} md={6} lg={4} className="mx-auto">
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      data-cy="username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicRole">
                    <Form.Label>Role</Form.Label>
                    <p></p>
                    <div>
                      <Form.Check
                        id="1"
                        type="radio"
                        label="User"
                        name="role"
                        value="user"
                        checked={role === 'user'}
                        onChange={handleRoleChange}
                      />
                      <Form.Check
                        id="2"
                        type="radio"
                        label="Admin"
                        name="role"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={handleRoleChange}
                      />
                    </div>
                    <p></p>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      data-cy="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                  </Form.Group>
                  <p></p>
                  <Button variant="primary" type="submit" style={{ width: '100%' }}>
                    Register
                  </Button>
                  <p></p>
                  <Button variant="secondary" onClick={toggleFormVisibility}>
                    Cancel
                  </Button>
                </Col>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      ) : (
        <Button variant="primary" onClick={toggleFormVisibility}>
          Add User
        </Button>
      )}
    </div>
  )
}
UserForm.propTypes = {
  onUserAdded: PropTypes.func.isRequired, // onUserAdded is expected to be a function
}
export default UserForm
