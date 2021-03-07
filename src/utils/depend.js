const path = require('path')
const { isExists, readDirs, splicing, readJson } = require('./')
const { uniq } = require('lodash')

/**
 * 收集根路径下的所有依赖
 * @param {string} rootPath 根路径
 */
function collectNodeModulesAllDeps(rootPath) {
  const deps = {
    dev: [],
    prod: []
  }

  collectCurrentDirDeps(rootPath, deps)

  // 去重
  Object.keys(deps).forEach((key) => {
    deps[key] = uniq(deps[key])
  })

  return deps
}

/**
 * 收集目标路径下的所有依赖，包括 node_modules 内的
 * @param {string} currentPath 目标路径
 * @param {Array} deps 收集依赖用的数组
 */
function collectCurrentDirDeps(currentPath, deps) {
  const nodeModulesPath = path.join(currentPath, 'node_modules')

  // 不管存不存在 node_modules ，先收集一次本层依赖
  collectPkgDeps(currentPath, deps)

  // 判断这个目录是否为作用域包
  const isScopeDeps = path.basename(currentPath).indexOf('@') === 0

  // 不存在 node_modules 且不是作用域包，遍历结束
  if (!isExists(nodeModulesPath) && !isScopeDeps) {
    return
  }

  // 若存在 node_modules，读取 node_modules 下所有目录，收集他们的依赖
  // 若是作用域包，读取该目录下的所有目录，依次收集他们的依赖
  const dirsFullPath = readDirs(isScopeDeps ? currentPath : nodeModulesPath)
  dirsFullPath.forEach((dir) => {
    collectCurrentDirDeps(dir, deps)
  })
}

/**
 * 收集目标路径下 package.json 的所有依赖
 * @param {string} path 目标路径
 * @param {Array} deps 依赖数组
 */
function collectPkgDeps(path, deps) {
  const pkgPath = splicing(path, 'package.json')

  // 不存在直接退出不收集
  if (!isExists(pkgPath)) {
    return
  }

  const pkg = readJson(pkgPath)

  if (pkg.devDependencies) {
    deps.dev = [...deps.dev, ...Object.keys(pkg.devDependencies)]
  }
  if (pkg.dependencies) {
    deps.prod = [...deps.prod, ...Object.keys(pkg.dependencies)]
  }

  return deps
}

module.exports = {
  collectNodeModulesAllDeps
}
