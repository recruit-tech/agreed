const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const minimist = require('minimist')
const serialize = require('serialize-javascript')

const argv = minimist(process.argv.slice(2))
const getAgreements = require('../server/lib/getAgreements')

const agreesPath = argv.path
const agrees = getAgreements({ path: agreesPath })
const serialized = serialize(agrees)

const srcPath = path.resolve(__dirname, '../build/index.html')
const destPath = path.resolve(argv.dest, 'index.html')

const html = fs.readFileSync(srcPath, 'utf8')

fse.copySync(path.dirname(srcPath), path.dirname(destPath))

fs.writeFileSync(destPath, html.replace(`"${'__AGREES__'}"`, serialized))
