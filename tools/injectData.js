const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const serialize = require('serialize-javascript')

const argv = minimist(process.argv.slice(2))
const getAgreements = require('../server/lib/getAgreements')

const agreesPath = argv.path
const agrees = getAgreements({ path: agreesPath })
const serialized = serialize(agrees)

const htmlPath = path.resolve(__dirname, 'build/index.html')
const destPath = path.resolve(process.cwd(), 'build/index.html')

const html = fs.readFileSync(htmlPath, 'utf8')

fs.writeFileSync(destPath, html.replace(`"${'__AGREES__'}"`, serialized))
