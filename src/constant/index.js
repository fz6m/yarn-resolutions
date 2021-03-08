const pkg = require('../../package.json')

const vType = {
  major: 'major',
  minor: 'minor'
}

const name = pkg.name

const NO_RESOLVE_CONFLICT_DEPS = ['source-map', 'fs-extra', 'git-raw-commits']

module.exports = {
  vType,
  name,
  NO_RESOLVE_CONFLICT_DEPS
}
