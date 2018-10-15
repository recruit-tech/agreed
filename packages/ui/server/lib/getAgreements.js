'use strict'

const path = require('path')
const register = require('agreed-core/lib/register')
const completion = require('agreed-core/lib/check/completion')
const requireUncached = require('agreed-core/lib/require_hook/requireUncached')
const format = require('agreed-core/lib/template/format')
const { parseSchema } = require('json-schema-to-flow-type')

module.exports = function(options) {
  const agreesPath = path.resolve(options.path)
  const base = path.dirname(agreesPath)

  register()

  const agrees = [].concat(requireUncached(agreesPath))
  return agrees.map((agree) => completion(agree, base)).map((agree) => {
    agree.request.headers_formatted = format(
      agree.request.headers,
      agree.request.values
    )
    agree.request.formatted = format(agree.request.body, agree.request.values)

    agree.response.formatted = format(
      agree.response.body,
      agree.response.values
    )

    if (agree.response.schema) {
      agree.response.flowtype = parseSchema(agree.response.schema)
    }

    return agree
  })
}
