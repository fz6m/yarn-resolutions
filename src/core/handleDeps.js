const { contain } = require('../utils')
const { trim } = require('lodash')

/**
 * 处理某依赖已依赖的所有版本
 * @param {String} deps 依赖信息行
 * @example
 *  lodash@1.0.0, lodash@1.0.1: =>
 *  [ { name: 'lodash', version: '1.0.0' }, { name: 'lodash', version: '1.0.1' } ]
 */
function handleDepsCurrentVerions(deps) {
  // 监测是否为含域依赖 ex: "@babel/core@7.0.0"
  const hasScope = contain(deps, '"')

  let result = deps.trim()

  result = trim(deps, ':').trim()

  result = result
    .split(',')
    .map((i) => i.trim())
    .map((i) => {
      // 含域依赖需清除引号
      const pureDep = hasScope ? trim(i, '"') : i
      const anchorPoint = pureDep.lastIndexOf('@')
      const name = pureDep.slice(0, anchorPoint)
      const version = pureDep.slice(anchorPoint + 1)
      return { name, version }
    })

  return result
}

/**
 * 收集已依赖的某个依赖所有的版本号为一个对象
 * @param {Array} deps 经过 handleDepsCurrentVerions 处理的依赖列表
 * @example
 *  [ { name: 'lodash', version: '1.0.0' }, { name: 'lodash', version: '1.0.1' } ]
 *  =>
 *  { name: 'lodash', version: [ '1.0.0', '1.0.1' ]}
 */
function handleDepsSummary(deps) {
  deps[0].version = [deps[0].version]
  return deps.reduce((first, current) => {
    first.version.push(current.version)
    return first
  })
}

/**
 * 处理依赖信息行
 * @param {String} deps 依赖信息行
 */
function handleDeps(deps) {
  return handleDepsSummary(handleDepsCurrentVerions(deps))
}

module.exports = {
  handleDeps
}
