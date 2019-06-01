'use strict'

const moment = require('moment')
const os = require('os')
const qs = require('querystring')

const http = require('./http')

const fetch = async (deploymentId) => {
  const url = http.url(http.endpoints.events, deploymentId)
  const events = await http.get(url, process.env.NOW_AUTH_TOKEN)

  return events
}

const format = async (logs) => {
  const lines = logs.map(log => {
    return {
      line: log.payload.text,
      type: log.payload.info.type,
      file: log.payload.info.path,
      timestamp: log.payload.date
    }
  })

  return { lines: lines }
}

const relay = async (data) => {
  const query = { hostname: os.hostname(), now: moment().unix() }
  const url = { base: 'https://logs.logdna.com', route: '/logs/ingest' }

  const response = await http.send(url, data, process.env.LOGDNA_INGESTION_KEY, qs.encode(query))
  return response
}

module.exports = {
  fetch,
  format,
  relay
}
