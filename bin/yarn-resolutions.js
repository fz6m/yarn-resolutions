#!/usr/bin/env node

const { program } = require('commander')
const pkg = require('../package.json')
const { run } = require('../src/cli')

// 支持的命令

// 1. 过滤版本: mode，可选，默认 major，可指定 minor
program
  .option('-m, --mode [mode]', 'filter version rules', 'major')
  .option('--no-mode', 'not filter the version')

// 2. yarn.lock 文件位置：path，可选，默认 ./yarn.lock
program.option('-p, --path <path>', 'yarn.lock file path', './yarn.lock')

// 3. 是否自动打开可视化冲突结果展示网页，默认打开
program
  .option(
    '-r, --report',
    'automatically open the conflict result web page',
    true
  )
  .option('--no-report', 'not report results')

// 4. 是否自动给 package.json 添加推荐建议的 resolutions，默认不自动
program.option(
  '-a, --auto',
  'automatically give resolutions suggestions in package.json',
  false
)

// version
program.version(pkg.version, '-v, --version', 'output the current version')

program.parse(process.argv)

const options = program.opts()

// 运行主程序
run(options)
