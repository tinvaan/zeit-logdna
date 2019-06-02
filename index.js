'use strict'

const program = require('commander')
const { withUiHook, htm } = require('@zeit/integration-utils')

const logs = require('./src/logs')

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

let count = 0
module.exports = withUiHook(({ payload }) => {
  count += 1
  return htm`
    <Page>
      <P>Counter: ${count}</P>
      <Button>Count Me</Button>
    </Page>
  `
})

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
      const events = await logs.fetch(deploy); console.log(events.data)
    }
  })

program.parse(process.argv)
