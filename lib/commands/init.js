const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const { stopSpinner } = require('../utils/spinner')

const create = async (projectName, options) => {
  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, projectName || '.')
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists.\n` +
          `Pick an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (!action) return
    if (action === 'overwrite') rimraf.sync(targetDir)
  }

  
}


module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
  })
}