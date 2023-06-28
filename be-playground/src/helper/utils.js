const API_URL = 'http://localhost:4000/api'

const chalk = require('chalk')

function env() {
  console.log('**** API_URL', API_URL, '****')
}

async function delay(ms) {
  return new Promise(r => setTimeout(() => r(), ms))
}

function hr() {
  console.log('-------------------------------------')
}

function logEventFactory(email, event) {
  return [event, (notifyId, data) => logEvent(email, event, notifyId, data)]
}

function logEvent(email, event, notifyId, data) {
  hr()
  console.log(chalk.bgYellow("event"), chalk.green(email), 'received')
  console.dir({
    event,
    notifyId,
    data: JSON.parse(data)
  }, {depth: null})
}

async function execAxios(promise) {
  try {
    const resp = await promise
    return readableResp(resp)
  } catch (e) {
    console.log('Request error:', readableResp(e))
  }
}

function buildAuthHeaders(token) {
  return {headers: {authorization: `Bearer ${token}`}}
}

async function readableResp(e) {
  if (e.data && e.data.data) {
    return e.data.data
  }
  if (e.response && e.response.data && e.response.data.error) {
    return e.response.data
  }
  return e.message
}

async function obj2QryStr(obj) {
  return Object.entries(obj).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
}

function randomUserId() {
  return Math.floor(Math.random() * 999)
}

function stepper() {
  let step = 0;
  return {
    next() {
      return chalk.yellow(`${++step}:`);
    }
  }
}

module.exports = {
  API_URL,
  env,
  readableResp,
  execAxios,
  buildAuthHeaders,
  delay,
  hr,
  logEvent,
  logEventFactory,
  obj2QryStr,
  randomUserId,
  stepper
}
