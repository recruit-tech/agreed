import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Definitions = ({ title, description, children }) => {
  return (
    <section className="definitions">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </section>
  )
}

Definitions.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.any,
}

export default Definitions
