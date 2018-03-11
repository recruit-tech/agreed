const path = require('path')
const minimist = require('minimist')
const express = require('express')

const argv = minimist(process.argv.slice(2))
const getAgreements = require('./lib/getAgreements')

const port = parseInt(argv.port, 10) || 3000
const agreedFilePath = argv.path

const app = express()

app.get('/agrees', (req, res) => {
  const agrees = getAgreements({ path: agreedFilePath })
  res.send(agrees)
})

app.use(express.static(path.resolve(__dirname, '../build')))

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line
})
