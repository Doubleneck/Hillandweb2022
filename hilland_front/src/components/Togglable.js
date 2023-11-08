import React from 'react'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible} className='text-center'>
        <Button variant="success" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div className='text-center togglableContent' style={showWhenVisible} >
        {props.children}
        <Button variant='secondary' onClick={toggleVisibility}> cancel </Button>
      </div>
    </div>
  )
}
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
export default Togglable