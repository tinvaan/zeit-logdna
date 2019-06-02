'use strict'

const http = require('./http')

class ProjectException extends Error {
  constructor (message) {
    super(message)
    this.name = 'ProjectException'
    this.message = message
  }
}

const Projects = {}
Projects.get = async (id = null, name = null) => {
  if (id === null && name === null) {
    throw new ProjectException('Project identifier not found')
  }

  const identifier = (id !== null ? id : name)
  const url = http.url(http.endpoints.projects.get, identifier)

  const target = await http.get(url, process.env.NOW_AUTH_TOKEN)
  return target
}

Projects.list = async (user = process.env.NOW_AUTH_TOKEN) => {
  const url = http.url(http.endpoints.projects.list)
  const all = await http.get(url, user)

  return all
}

module.exports = {
  Projects
}
