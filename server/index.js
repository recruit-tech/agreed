const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const serialize = require('serialize-javascript')
const express = require('express')
const template = require('lodash.template')

const argv = minimist(process.argv.slice(2))
const getAgreements = require('./lib/getAgreements')

const port = parseInt(argv.port, 10) || 3000
const agreesPath = argv.path

const app = express()

app.get('/agrees', (req, res) => {
  const agrees = getAgreements({ path: agreesPath })
  res.send(agrees)
})

app.get('/', (req, res) => {
  const agrees = getAgreements({ path: agreesPath })
  const serialized = serialize(agrees)

  const srcPath = path.resolve(__dirname, '../build/index.html')
  const html = fs.readFileSync(srcPath, 'utf8')
  res.send(
    template(html, { interpolate: /"<%=([\s\S]+?)%>"/g })({
      agrees: serialized,
      title: argv.title,
    })
  )
})

app.use(express.static(path.resolve(__dirname, '../build')))

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line
})
