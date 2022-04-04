import React from 'react'

const TextBarButton = ({ icon, style }) => {
  return (
    <button>
        <i className={`${style} fa-${icon}`}></i>
    </button>
  )
}

TextBarButton.defaultProps = {
    style: "fas"
}

export default TextBarButton