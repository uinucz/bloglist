import React from 'react'

const Success = (props) => {
  const successStyle = {
    color: 'green',
    background: 'white',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (props.message === null) {
    return null
  }

  return (
    <div className="success" style={successStyle}>
      {props.message}
    </div>
  )
}

export default Success
