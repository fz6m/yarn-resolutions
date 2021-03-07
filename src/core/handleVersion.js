const { trim } = require('lodash')

/**
 * 处理版本信息行
 * @param {String} version 版本信息行
 * @example
 *  version "1.0.0"
 *  =>
 *  1.0.0
 */
function handleVersion(version) {
  const v = version.trim().replace('version', '').trim()
  return trim(v, '"')
}

module.exports = {
  handleVersion
}
