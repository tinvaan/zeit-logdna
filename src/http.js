'use strict'

const axios = require('axios')
const qs = require('querystring')

class UrlException extends Error {
  constructor (message) {
    super(message)
    this.name = 'UrlException'
    this.message = message
  }
}

const baseUrl = 'https://api.zeit.co'
const endpoints = {
  user: '/www/user',
  deployments: {
    get: '/v9/now/deployments/$_identifier',
    list: '/v4/now/deployments',
    create: '/v9/now/deployments',
    delete: '/v9/now/deployments/$_identifier'
  },
  events: '/v2/now/deployments/$_identifier/events',
  projects: {
    list: '/v1/projects/list',
    get: '/v1/project/$_identifier'
  }
}

const url = (endpoint, identifier = null) => {
  if (endpoint.includes('$_identifier') && identifier === null) {
    throw new UrlException(endpoint)
  }

  return baseUrl + endpoint.replace('$_identifier', identifier)
}

const get = (url, token) => {
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return axios.get(url, { headers: headers })
    .then(response => { return response })
    .catch(err => { return err })
}

const send = (url, data = null, user = null, query = null) => {
  return axios({
    method: 'POST',
    url: url.base + url.route + '?' + query,
    auth: { username: user, password: '' },
    data: data
  })
    .then(response => { return response })
    .catch(err => { return err })
}

const post = (url, data = null, token = null, query = null) => {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = 'application/json; charset=UTF-8'

  const requestUrl = (query === null ? baseUrl + url : baseUrl + url + '?' + qs.encode(query))
  return axios.post(requestUrl, data, { headers: headers })
    .then(response => { return response })
    .catch(err => { return err })
}

module.exports = {
  post,
  send,
  get,
  url,
  endpoints,
  UrlException
}
