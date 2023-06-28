const axios = require('axios');
const {execAxios, obj2QryStr, API_URL, readableResp, delay, buildAuthHeaders} = require('./utils');
const socketIO = require('socket.io-client');
const chalk = require('chalk')

async function basicAuth(username, password) {
  return execAxios(axios.post(`${API_URL}/user/sign-in`, {email: username, password}))
}

async function login(userIndex) {
  return execAxios(axios.post(`${API_URL}/user/sign-in`, {email: `${userIndex}@x.yz`, password: '123ASD!@#'}))
}

async function connectSocket(userIndex) {
  try {
    const {token, user} = await login(userIndex)
    const socket = socketIO(`${API_URL}/?token=${token}`)
    socket.on('connect', () => console.log(chalk.green(user.email), '<->', chalk.green(user._id)))
    await delay(50)
    return {token, user, socket}
  } catch (e) {
    console.error(readableResp(e))
    process.exit(1)
  }
}

async function getMyInfo(user) {
  return execAxios(axios.get(`${API_URL}/user/profile`, buildAuthHeaders(user.token)))
}

async function getUserById(fromUser, userId) {
  return execAxios(axios.get(`${API_URL}/user/profile/${userId}`, buildAuthHeaders(fromUser.token)))
}

async function updateUserProfile(user, profile) {
  return execAxios(axios.put(`${API_URL}/user/profile`, profile, buildAuthHeaders(user.token)))
}

module.exports = {
  basicAuth,
  login,
  connectSocket,
  getMyInfo,
  getUserById,
  updateUserProfile
}
