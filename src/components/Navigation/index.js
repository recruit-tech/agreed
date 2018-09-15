import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'
import MethodLabel from '../MethodLabel'

const groupByRequestPath = (list) => {
  const ret = {}
  for(let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    const key = `${item.request.path}_${item.request.method}`
    ret[key] = [...(ret[key] || []), item]
  }
  return ret
}

const StatusLabel = ({status}) => (
  <span className={`statusLabel statusLabel--${Math.floor(status/100)}`}>{status}</span>
)

StatusLabel.propTypes = {
  status: PropTypes.number.isRequired,
}

const NaviItem = ({ agree }) => (
  <p>
    <a href={`#${agree.id}`}>
      <MethodLabel method={agree.request.method} />
      <span>{agree.title || agree.request.path}</span>
    </a>
  </p>
)

NaviItem.propTypes = {
  agree: PropTypes.object.isRequired,
}

const GroupedItem = ({ agree }) => (
  <p>
    <a href={`#${agree.id}`}>
      <StatusLabel status={agree.response.status} />
      <span>{agree.title || 'no title'}</span>
    </a>
  </p>
)

GroupedItem.propTypes = {
  agree: PropTypes.object.isRequired,
}

const Details = ({path, agrees}) => { 
  const [name, method] = path.split('_')
  return (
    <details open>
      <summary>
        <MethodLabel method={method} />
        <span>{name}</span>
        { agrees.length > 1 && <span className="count">{agrees.length}</span>}
      </summary>
        {agrees.map((agree, i) =>
          <GroupedItem key={agree.id} agree={agree} />
        )}
    </details>
  )
}

Details.propTypes = {
  path: PropTypes.string.isRequired,
  agrees: PropTypes.array.isRequired,
}

const Grouped = ({agrees}) => {
  const grouped = groupByRequestPath(agrees)
  const pathList = Object.keys(grouped)
  return (
    <React.Fragment>
      {pathList.map((path, i) => <Details key={path} path={path} agrees={grouped[path]} /> )}
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
