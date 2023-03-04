import { useState } from 'react'
import Button from 'react-bootstrap/Button'
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
      <div className='text-center' style={showWhenVisible}>
        {props.children}
        <Button variant='secondary' onClick={toggleVisibility}> cancel </Button>
      </div>
    </div>
  )
}

export default Togglable