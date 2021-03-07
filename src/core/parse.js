const { handleDeps } = require('./handleDeps')
const { handleVersion } = require('./handleVersion')

const { contain } = require('../utils')

/**
 * 核心解析方法入口
 * @param {String} content 读取的 yarn.lock 内容
 */
function parse(content) {
  // 接收 yarn.lock 文件内容行
  const lines = content
    .split('\n')
    .map((i) => i.trim())
    .filter(Boolean)

  // 收集依赖
  const deps = collectionDep(lines)

  return deps
}

/**
 * 收集依赖方法
 * @param {Array} lines yarn.lock 文件内容行数组
 */
function collectionDep(lines) {
  const deps = []

  for (let i = 0; i < lines.length; i++) {
    if (i + 2 < lines.length) {
      const [f, s, t] = [lines[i], lines[i + 1], lines[i + 2]]
      const hasRequire = {
        f: contain(f, [':', '@']),
        s: contain(s, ['version ', '"']),
        t: contain(t, ['resolved ', '"'])
      }
      if (hasRequire.f && hasRequire.s && hasRequire.t) {
        deps.push({
          ...handleDeps(f),
          currentVersion: handleVersion(s)
        })
        i = i + 2 < lines.length ? i + 2 : lines.length - 1
      }
    }
  }

  return deps
}

module.exports = {
  parse
}
