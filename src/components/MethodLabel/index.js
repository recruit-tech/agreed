import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

function MethodLabel({ method, status = 200 }) {
  const m = method.toLowerCase()
  return <span className={`method ${m}`}>{`${m.toUpperCase()}:${status}`}</span>
}

MethodLabel.propTypes = {
  method: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
}

export default MethodLabel
