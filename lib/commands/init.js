const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const { stopSpinner } = require('../utils/spinner')
const conf = require('../Conf')
const { createPromptChoices, downloadTemplate } = require('../utils/create')

const create = async (projectName, options) => {
  debugger
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
  const config = await conf.getConfig()
  const choices = createPromptChoices(config.list)
  const { repoUrl } = await inquirer.prompt([
    {
      name: 'repoUrl',
      type: 'list',
      message: 'Please choose a template below:',
      choices
    }
  ])
  debugger
  const downloadRes = await downloadTemplate(repoUrl, targetDir)
  console.log(downloadRes);
}


module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    console.log(err)
    process.exit(1)
  })
}