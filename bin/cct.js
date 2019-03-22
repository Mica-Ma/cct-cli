#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const requiredVersion = require('../package.json').engines.node
const { checkNodeVersion, cleanArgs } = require('../lib/utils/util')

const conf = require('../lib/Conf')


// 错误信息
require('../lib/utils/enhanceErrorMessages')

// 检查node版本
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

program
  .command('config')
  .description('🛠  global config for cct-cli')
  .option('-r, --reset', 'Reset global config')
  .option(
    '-f, --filters <ruleName>',
    'Add filter rules for replace files'
  )
  .action((cmd) => {
    // require('../lib/commands/config')(cleanArgs(cmd))
  })

program
  .command('ls')
  .description('📗  list all templates (force fresh cached templates)')
  .action((cmd) => {
    // require('../lib/commands/list')(cleanArgs(cmd))
    console.log(conf.getConfig());
    
  })


program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

program.commands.forEach((c) => c.on('--help', () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}


