import React, { Component } from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import classNames from 'classnames'
import './styles.css'

class Body extends Component {
  constructor(props) {
    super(props)
    this.state = { selected: 'body' }
  }

  onClick(selected) {
    this.setState({ selected })
  }

  render({ formatted, schema, flowtype } = this.props) {
    const { selected } = this.state
    return (
      <section className="body">
        <div className="buttonGroup">
          <button
            className={classNames('tabButton', {
              onlyButton: !schema,
            })}
            onClick={() => this.onClick('body')}
            disabled={selected === 'body'}>
            body
          </button>
          {schema && (
            <button
              className="tabButton"
              onClick={() => this.onClick('schema')}
              disabled={selected === 'schema'}>
              schema
            </button>
          )}
          {flowtype && (
            <button
              className="tabButton"
              onClick={() => this.onClick('flowtype')}
              disabled={selected === 'flowtype'}>
              flowtype
            </button>
          )}
        </div>
        {selected === 'schema' && (
          <div className="code">
            <JSONTree
              data={schema}
              shouldExpandNode={(keyName, data, level) => level < 2}
            />
          </div>
        )}
        {selected === 'flowtype' && <pre className="code">{flowtype}</pre>}
        {selected === 'body' && (

          <div className="code">
            {(formatted instanceof Object)
              ? <JSONTree
                  data={formatted}
                  shouldExpandNode={(keyName, data, level) => level < 2}
                />
              : formatted
            }
          </div>
        )}
      </section>
    )
  }
}

Body.propTypes = {
  formatted: PropTypes.any.isRequired,
  schema: PropTypes.object,
  flowtype: PropTypes.any,
}

export default Body
