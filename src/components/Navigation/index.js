import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'
import MethodLabel from '../MethodLabel'

const groupByRequestPath = (list) => {
  const ret = {}
  for(let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    const path = item.request.path
    ret[path] = [...(ret[path] || []), item]
  }
  return ret
}

const NaviItem = ({ agree, grouped }) => {
  const method = agree.request.method.toLowerCase()
  const path = agree.request.path
  const status = agree.response.status
  return (
    <p>
      <a href={`#${agree.id}`}>
        <MethodLabel method={method} status={status || 200} />
        <span>{agree.title ||  path}</span>
      </a>
    </p>
  )
}

NaviItem.propTypes = {
  agree: PropTypes.object.isRequired,
  grouped: PropTypes.bool,
}

const Details = ({path, agrees}) => (
  <details open>
    <summary><span>{path}</span>{ agrees.length > 1 && <span className="count">{agrees.length}</span>}</summary>
    {agrees.map((agree, i) =>
      <NaviItem key={agree.id} agree={agree} grouped={true} />
    )}
  </details>
)

Details.propTypes = {
  path: PropTypes.string.isRequired,
  agrees: PropTypes.array.isRequired,
}

const Grouped = ({agrees}) => {
  const grouped = groupByRequestPath(agrees)
  const pathList = Object.keys(grouped)
  return (
    <React.Fragment>
      {pathList.map((path, i) => <Details path={path} agrees={grouped[path]} /> )}
    </React.Fragment>
  )
}

Grouped.propTypes = {
  agrees: PropTypes.array.isRequired,
}

function Navigation({ agrees, grouped }) {
  return (
    <nav>
      { grouped
        ? <Grouped agrees={agrees} />
        : agrees.map((agree, i) => <NaviItem key={i} agree={agree} />)
      }
    </nav>
  )
}

Navigation.propTypes = {
  agrees: PropTypes.array.isRequired,
  grouped: PropTypes.bool.isRequired,
}

export default Navigation
