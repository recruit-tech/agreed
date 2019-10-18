import React from 'react'
import PropTypes from 'prop-types'
import Request from '../Request'
import Response from '../Response'
import MethodLabel from '../MethodLabel'
import './styles.css'

const Agree = ({ agree }) => {
  const path = agree.request.path
  const status = agree.response.status
  return (
    <section className="agree" id={agree.id}>
      <h1 className="title">
        <MethodLabel method={agree.request.method} status={status} />
        {agree.title || path}
      </h1>
      <div className="description">{agree.description || 'no description.'}</div>

      <h2>Request</h2>
      <Request data={agree.request} />
      <h2>Response</h2>
      <Response data={agree.response} />
    </section>
  )
}

Agree.propTypes = {
  agree: PropTypes.object.isRequired
}

export default Agree
