const {
  isExists,
  splicing,
  print,
  readJson,
  readFile,
  writeJsonFile,
  writeHtmlFile
} = require('../utils')
const { name } = require('../constant')

/**
 * 给 package.json 自动添加 resolutions 内容
 * @param {string} path 含有 package.json 的目标路径目录
 * @param {Object} addContent resolutions 对象
 */
function autoWriteToPkg(path, addContent) {
  const pkgPath = splicing(path, 'package.json')

  if (!isExists(pkgPath)) {
    print.error(
      `[${name}]: package.json not exist, resolutions suggestions cannot be added automatically`
    )
    return
  }

  const pkgContent = readJson(pkgPath)

  if (pkgContent.resolutions) {
    pkgContent.resolutions = {
      ...pkgContent.resolutions,
      ...addContent
    }
  } else {
    pkgContent.resolutions = addContent
  }

  writeJsonFile(pkgPath, pkgContent)
  print.success(
    `[${name}]: package.json has automatically added recommended resolutions`
  )
}

/**
 * 将生成的冲突信息对象注入 HTML 中，使结果可视
 * @param {Object} obj 冲突信息对象
 */
function generateWebPage(obj) {
  const templatePath = splicing(__dirname, '../template/index.html')
  const outputPath = splicing(__dirname, '../template/output.html')

  let content = readFile(templatePath)

  Object.keys(obj).forEach((key) => {
    content = content.replace(
      `'<%= ${key} %>'`,
      JSON.stringify(obj[key], null, 2)
    )
  })

  writeHtmlFile(outputPath, content)

  return outputPath
}

module.exports = {
  autoWriteToPkg,
  generateWebPage
}
