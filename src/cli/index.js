const { isExists, print, readFile } = require('../utils')
const { name, vType } = require('../constant')
const { parse } = require('../core')
const {
  handleConflict,
  clearNotProdDeps,
  clearDiffVersion,
  clearCustomDeps,
  generatorResolution
} = require('../core/handleConflict')
const { autoWriteToPkg, generateWebPage } = require('../resolutions')

const open = require('open')
const ora = require('ora')

const run = (options) => {
  const {
    path = './yarn.lock',
    mode = vType.major,
    auto = false,
    report = true
  } = options

  // 1. 监测 yarn.lock 是否存在
  if (!isExists(path)) {
    print.error(`[${name}]: yarn.lock does not exist`)
    return
  }

  // 2. 读取 yarn.lock 文件
  const content = readFile(path)

  // 3. 收集依赖
  const deps = parse(content)
  const spinner = ora(
    print.addColor(
      `[${name}]: start detecting dependency conflicts\n`,
      'yellow'
    )
  ).start()

  // 4. 收集冲突
  let conflictDeps = handleConflict(deps)

  // 5. 清理不必要的冲突
  const rootPath = process.cwd()
  conflictDeps = clearNotProdDeps(rootPath, conflictDeps)
  conflictDeps = clearCustomDeps(conflictDeps)
  conflictDeps = clearDiffVersion(conflictDeps, mode)
  spinner.stop()

  // 6. 提示冲突数量
  if (!conflictDeps.length) {
    print.success(`[${name}]: awesome, you have no conflicting dependencies`)
    return
  }
  print.warn(
    `[${name}]: currently ${conflictDeps.length} conflicting dependencies`
  )

  // 7. 自动给 package.json 添加推荐建议
  const recommendResolutions = generatorResolution(conflictDeps)
  if (auto) {
    autoWriteToPkg(rootPath, recommendResolutions)
  }

  // 8. 生成报告页面
  if (report) {
    const reportPath = generateWebPage({
      recommend: recommendResolutions,
      conflict: conflictDeps
    })
    print.success(
      `[${name}]: yarn recommend resolutions web page generated successfully. opening...`
    )
    // 打开报告
    open(reportPath)
  }
}

module.exports = { run }
