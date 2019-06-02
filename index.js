'use strict'

const moment = require('moment')
const program = require('commander')
const { htm, withUiHook } = require('@zeit/integration-utils')

const logs = require('./src/logs')
const { Projects } = require('./src/now')
const { Table, TableRow, HeaderItem, BodyItem } = require('./src/views/components')

const table = {}
table.headerString = () => {
  return htm`
    ${HeaderItem('Url')}
    ${HeaderItem('Created on')}
    ${HeaderItem('State')}
    ${HeaderItem('Logged')}
  `
}

table.bodyString = (deployments) => {
  return htm`
  ${deployments.map(instance => TableRow(table.rowString(instance)))}
  `
}

table.rowString = (instance) => {
  return htm`
    ${BodyItem(instance.url)}
    ${BodyItem(moment.unix(instance.created))}
    ${BodyItem(instance.state)}
    ${BodyItem('YES')}
    ${BodyItem(htm`<Button small action="viewLogDNA">View</Button>`)}
  `
}

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  if (payload.project === null || payload.projectId === null) {
    return htm`
      <Page>
        <H2>Select project from the dropdown below</H2>
        <ProjectSwitcher />
      </Page>
    `
  }

  const all = await zeitClient.fetchAndThrow(`/v4/now/deployments?projectId=${payload.projectId}`, { method: 'GET' })
  return htm`
    <Page>
      <ProjectSwitcher />
      <BR /><BR /><BR />
      <H1>Deployments for "${payload.project.name}"</H1>
      ${Table(table.headerString(), table.bodyString(all.deployments))}
    </Page>
  `
})

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
  .option('--fetch', 'list deployment ')
  .option('--export', 'export logs to LogDNA')
  .option('--format', 'format logs to LogDNA format')
  .action(async (deploy, action) => {
    const events = await logs.fetch(deploy)
    const formatted = await logs.format(events.data)

    if (action.format) console.log(formatted)
    else if (action.list || action.fetch) console.log(events.data)
    else if (action.export) {
      const exported = await logs.relay(formatted)
      console.log(exported)
    }
  })

program.parse(process.argv)
