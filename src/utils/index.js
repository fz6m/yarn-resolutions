const fs = require('fs-extra')
const { uniq } = require('lodash')
const chalk = require('chalk')
const prettier = require('prettier')
const path = require('path')

const log = console.log

function isExists(path) {
  return fs.existsSync(path)
}

function readFile(path) {
  return fs.readFileSync(path, 'utf-8')
}

function readJson(path) {
  return fs.readJsonSync(path, { encoding: 'utf-8' })
}

function writeJsonFile(path, content) {
  if (typeof content !== 'string') {
    content = prettier.format(JSON.stringify(content, null, 4), {
      parser: 'json'
    })
  }
  fs.writeFileSync(path, content)
}

function writeHtmlFile(path, content) {
  if (typeof content !== 'string') {
    content = prettier.format(content, {
      parser: 'html'
    })
  }
  fs.writeFileSync(path, content)
}

function contain(str, findStr) {
  const containTarget = (origin, target) => {
    return !!~origin.indexOf(target)
  }

  if (Array.isArray(findStr)) {
    return findStr.map((i) => containTarget(str, i)).every((i) => i)
  }

  return containTarget(str, findStr)
}

function splicing(...paths) {
  return path.join(...paths)
}

function isDir(path) {
  return fs.statSync(path).isDirectory()
}

/**
 * 读取一个路径下所有文件夹的完整路径
 * @param {string} path 目标路径
 */
function readDirs(path) {
  const files = fs.readdirSync(path)

  const dirs = []

  files.forEach((file) => {
    const fullPath = splicing(path, file)
    if (isDir(fullPath)) {
      dirs.push(fullPath)
    }
  })

  return dirs
}

/**
 * 比较数组内元素是否存在差别
 * @param {Array} list
 */
function hasDiff(list) {
  const len = uniq(list).length
  return len !== 1
}

const print = {
  warn: (content) => {
    log(chalk.bold.yellow(content))
  },
  success: (content) => {
    log(chalk.bold.green(content))
  },
  error: (content) => {
    log(chalk.bold.red(content))
  },
  addColor: (content, color) => {
    return chalk.bold[color](content)
  }
}

module.exports = {
  isExists,
  log,
  readFile,
  readJson,
  writeJsonFile,
  contain,
  hasDiff,
  print,
  isDir,
  readDirs,
  splicing,
  writeHtmlFile
}
