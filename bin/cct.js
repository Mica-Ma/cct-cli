#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const requiredVersion = require('../package.json').engines.node
const { checkNodeVersion, cleanArgs } = require('../lib/utils/util')

// node version check
checkNodeVersion(requiredVersion, 'cct-cli')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('init <app-name>')
  .description('✈️  create a new project from template')
  .action((name, cmd) => {
    require('../lib/commands/init')(name, cleanArgs(cmd))
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}


