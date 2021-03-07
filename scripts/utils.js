const chalk = require('chalk')
const inquirer = require('inquirer')
const log = console.log

const print = (text = '', color = '#b8d38f') => {
  log(chalk.hex(color).bold(text))
}

/**
 * 选择列表
 * @returns {Promise}
 */
const select = (list, title, key = 'selected') => {
  const result = inquirer.prompt([
    {
      type: 'list',
      name: key,
      message: title,
      choices: list
    }
  ])
  return result.then((res) => res[key])
}

module.exports = {
  print,
  select,
  log
}
