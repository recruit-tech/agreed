import React from 'react'
import PropTypes from 'prop-types'
import Agree from '../Agree'
import './styles.css'

function Agrees({ agrees }) {
  return (
    <div className="contents">
      {agrees.map((agree) => (
        <Agree key={agree.id} agree={agree} />
      ))}
    </div>
  )
}

Agrees.propTypes = {
  agrees: PropTypes.array.isRequired
}

export default Agrees
