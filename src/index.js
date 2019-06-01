'use strict'

const program = require('commander')

const logs = require('./logs')

const format = async (deploy) => {
  const events = await logs.fetch(deploy)
  const formatted = await logs.format(events.data)

  return formatted
}

const transport = async (deploy) => {
  const events = await logs.fetch(deploy)
  const formatted = await logs.format(events.data)

  const response = await logs.relay(formatted)
  return response
}

program
  .version('1.0.0')

program
  .command('logs <deployment>')
  .option('--list', 'list deployments')
  .option('--fetch', 'list deployment ')
  .option('--export', 'export logs to LogDNA')
  .option('--format', 'format logs to LogDNA format')
  .action(async (deploy, action) => {
    if (action.export) {
      const exported = await transport(deploy); console.log(exported)
    } else if (action.format) {
      const formatted = await format(deploy); console.log(formatted)
    } else if (action.list || action.fetch) {
      const events = await logs.fetch(deploy); console.log(events)
    }
  })

program.parse(process.argv)
