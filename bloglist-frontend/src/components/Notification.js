import React from 'react'
//import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'red',
    background: 'white',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  )
}

// Notification.propTypes = {
//   message: PropTypes.string.isRequired,
// }

export default Notification
