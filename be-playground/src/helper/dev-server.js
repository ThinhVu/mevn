const axios = require('axios');
const {execAxios, API_URL} = require('./utils');

async function cleanup() {
  console.log('reset dev server')
  const rs = await execAxios(() => axios.post(`${API_URL}/dev-server/reset`))
  console.log(rs)
}

module.exports = {
  cleanup
}
