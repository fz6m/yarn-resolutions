const semver = require('semver')
const { hasDiff } = require('../utils')
const { collectNodeModulesAllDeps } = require('../utils/depend')
const { includes } = require('lodash')
const { NO_RESOLVE_CONFLICT_DEPS } = require('../constant')

/**
 * 收集冲突依赖
 * @param {Array} deps 经过 handleDeps 处理完依赖的数组
 */
function handleConflict(deps) {
  const conflict = {}

  for (let i = 0; i < deps.length; i++) {
    const { name } = deps[i]
    const tailArr = deps.slice(i + 1)

    const repeatDeps = []
    tailArr.forEach((d) => {
      if (d.name === name) {
        repeatDeps.push(d)
      }
    })

    if (repeatDeps.length) {
      const has = conflict[name]
      if (!has) {
        conflict[name] = assign([deps[i], ...repeatDeps])
      }
    }
  }

  return Object.values(conflict)
}

/**
 * 合并所有起冲突的依赖版本号
 * @param {Array} deps 合并版本号的数组
 */
function assign(deps) {
  const dep = {
    name: deps[0].name,
    dependenciesVersion: [],
    currentVersion: []
  }
  deps.forEach((d) => {
    dep.dependenciesVersion = [...dep.dependenciesVersion, d.version]
    dep.currentVersion = [...dep.currentVersion, d.currentVersion]
  })
  return dep
}

/**
 * 清理非生产环境依赖
 * @param {string} rootPath 目标含有 node_modules 和 package.json 的根路径
 * @param {Array} deps 收集过冲突的数组
 */
function clearNotProdDeps(rootPath, deps) {
  const allDeps = collectNodeModulesAllDeps(rootPath)
  return deps.filter((dep) => includes(allDeps.prod, dep.name))
}

/**
 * 清理一些自定义不需要解决冲突的依赖
 * @param {Array} deps 收集过冲突的数组
 */
function clearCustomDeps(deps) {
  return deps.filter((dep) => !NO_RESOLVE_CONFLICT_DEPS.includes(dep.name))
}

/**
 * 清除数组内有指定版本差别的元素
 * @param {Array} deps 依赖版本号的数组
 * @param {Enum|false} mode 比较模式
 */
function clearDiffVersion(deps, mode) {
  if (!mode) {
    return deps
  }

  const result = []
  deps.forEach((d) => {
    const currentVersion = d.currentVersion.map((version) => {
      return semver[mode](version)
    })
    if (!hasDiff(currentVersion)) {
      result.push(d)
    }
  })
  return result
}

/**
 * 获取可以 resolution 的最新版本对象
 * @param {Array} deps 秒数依赖版本号的数组
 */
function generatorResolution(deps) {
  const result = {}
  deps.forEach((d) => {
    const ascVersions = semver.sort(d.currentVersion)
    result[d.name] = ascVersions[ascVersions.length - 1]
  })
  return result
}

module.exports = {
  handleConflict,
  clearDiffVersion,
  clearNotProdDeps,
  generatorResolution,
  clearCustomDeps
}
