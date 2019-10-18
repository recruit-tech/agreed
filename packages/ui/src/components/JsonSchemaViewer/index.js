import React, { Component } from 'react'
import PropTypes from 'prop-types'
import JSONSchemaView from 'json-schema-view-js'
import 'json-schema-view-js/dist/style.css'
import './styles.css'

class JsonSchemaViewer extends Component {
  mountViewer(el, schema) {
    el.appendChild(new JSONSchemaView(schema, 1).render())
  }

  render({ schema } = this.props) {
    return (
      <div
        className="schemaViewer"
        ref={el => {
          if (el) this.mountViewer(el, schema)
        }}
      />
    )
  }
}

JsonSchemaViewer.propTypes = {
  schema: PropTypes.object
}

export default JsonSchemaViewer
