import React from 'react'

const Mask = (props) => {

  const maskStyle = {
    display: props.visibility ? '' : 'none',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: '2'
  }

  return (
    <div style={maskStyle} onClick={props.onClick}></div>
  )
}

export default Mask