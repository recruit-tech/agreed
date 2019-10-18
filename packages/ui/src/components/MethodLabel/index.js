import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

function MethodLabel({ method }) {
  const m = method.toLowerCase()
  return <span className={`method ${m}`}>{m.toUpperCase()}</span>
}

MethodLabel.propTypes = {
  method: PropTypes.string.isRequired
}

export default MethodLabel
