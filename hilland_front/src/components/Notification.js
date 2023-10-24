import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector((state) => state.notification.content)
  const type = useSelector((state) => state.notification.type)

  if (notification) {
    if (type === 'update') {
      return <div className="update">{notification}</div>
    }
    if (type === 'error') {
      return <div className="error">{notification}</div>
    }
  }
}

export default Notification