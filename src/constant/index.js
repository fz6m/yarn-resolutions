const pkg = require('../../package.json')

const vType = {
  major: 'major',
  minor: 'minor'
}

const name = pkg.name

module.exports = {
  vType,
  name
}
