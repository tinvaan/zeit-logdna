'use strict'

const { htm, withUiHook } = require('@zeit/integration-utils')

const views = require('./src/ui/views')
const { Table } = require('./src/ui/components')

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
      ${Table(views.tableHeader(), views.tableBody(all.deployments))}
    </Page>
  `
})
