#!/usr/bin/env node

const chalk = require("chalk")
const semver = require("semver")
const requiredVersion = require("../package.json").engines.node

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "You are using Node " +
        process.version +
        ", but this version of " +
        id +
        " requires Node " +
        wanted +
        ".\nPlease upgrade your Node version."
      )
    )
    process.exit(1)
  }
}

// node version check
checkNodeVersion(requiredVersion, "cct-cli")

const program = require("commander")
program.version(require("../package").version).usage("<command> [options]")

program
  .command("init <app-name>")
  .description("✈️  create a new project from template")
  .action((name, cmd) => {
    require("../lib/commands/init")(name, filterArgs(cmd))
  })

program
  .command("init <app-name>")
  .description("✈️  create a new project from template")
  .action((name, cmd) => {
    require("../lib/commands/init")(name, filterArgs(cmd))
  })

program
  .command("config")
  .description("🛠  global config for xpfe-cli")
  .option("-f, --filters <ruleName>", "Add filter rules for replace files")
  .action(cmd => {
    require("../lib/commands/config")(filterArgs(cmd))
  })

program
  .command("ls | list")
  .description("📗  list all templates (force fresh cached templates)")
  .action(cmd => {
    require("../lib/commands/list")(filterArgs(cmd))
  })

program.on("--help", () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`cct <command> --help`)} for more help`)
  console.log()
})

program.commands.forEach(c => c.on("--help", () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
