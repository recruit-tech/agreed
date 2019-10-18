import React from 'react'
import PropTypes from 'prop-types'
import Definitions from '../Definitions'
import Body from '../Body'

const Response = ({ data }) => {
  const { status, formatted, schema, flowtype } = data
  return (
    <div>
      <Definitions title="statusCode" description={`${status}`} />
      {formatted && <Body formatted={formatted} schema={schema} flowtype={flowtype} />}
    </div>
  )
}

Response.propTypes = {
  data: PropTypes.object.isRequired
}

export default Response
