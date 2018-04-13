import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'
import MethodLabel from '../MethodLabel'

const NaviItem = ({ agree, index }) => {
  const method = agree.request.method.toLowerCase()
  const path = agree.request.path
  return (
    <p>
      <a href={`#section_${index}`}>
        <MethodLabel method={method} />
        <span>{agree.title || path}</span>
      </a>
    </p>
  )
}

NaviItem.propTypes = {
  agree: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

function Navigation({ agrees }) {
  return (
    <nav>
      {agrees.map((agree, i) => <NaviItem key={i} index={i} agree={agree} />)}
    </nav>
  )
}

Navigation.propTypes = {
  agrees: PropTypes.array.isRequired,
}

export default Navigation
