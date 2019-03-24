const download = require('download-git-repo')
const { logWithSpinner, stopSpinner } = require('./spinner')
const chalk = require('chalk')

exports.createPromptChoices = (list) => {
  // logWithSpinner('🌀', 'Loading templates, please wait...')
  // stopSpinner()
  return (list || []).map(val => {
     return {
      name: `${val.name} (${val.description})`,
      value: val.full_name || val.url
    }
  })
}

exports.downloadTemplate = async (url, dir) => {
  return new Promise((resolve, reject) => {
    logWithSpinner('✨', `Creating project in ${chalk.yellow(dir)}`)
    download(url, dir, (err) => {
      if (err) {
        reject(err)
      } else {
        stopSpinner()
        resolve(dir)
      }
    })
  })
}