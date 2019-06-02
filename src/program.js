'use strict'

const program = require('commander')

const logs = require('./logs')
const { Projects } = require('./now')

program
  .version('1.0.0')

program
  .command('projects')
  .option('--list', 'list all projects')
  .action(async (action) => {
    if (action.list) {
      const projects = await Projects.list()
      console.log(projects.data)
    }
  })

program
  .command('logs <deployment>')
  .option('--list', 'list deployments')
  .option('--export', 'export logs to LogDNA')
  .option('--format', 'format logs to LogDNA format')
  .action(async (deploy, action) => {
    const events = await logs.fetch(deploy)
    const formatted = await logs.format(events.data)

    if (action.format) console.log(formatted)
    else if (action.list) console.log(events.data)
    else if (action.export) {
      const exported = await logs.relay(formatted)
      console.log(exported)
    }
  })

program.parse(process.argv)