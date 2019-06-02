'use strict'

const moment = require('moment')
const { htm } = require('@zeit/integration-utils')

const { TableRow, HeaderItem, BodyItem } = require('./components')

const tableRow = (instance) => {
  return htm`
    ${BodyItem(instance.url)}
    ${BodyItem(moment.unix(instance.created))}
    ${BodyItem(instance.state)}
    ${BodyItem('YES')}
    ${BodyItem(htm`<Button small action="viewLogDNA">View</Button>`)}
  `
}

const tableHeader = () => {
  return htm`
    ${HeaderItem('Url')}
    ${HeaderItem('Created on')}
    ${HeaderItem('State')}
    ${HeaderItem('Logged')}
  `
}

const tableBody = (deployments) => {
  return htm`
  ${deployments.map(instance => TableRow(tableRow(instance)))}
  `
}

module.exports = {
  tableRow,
  tableHeader,
  tableBody
}
