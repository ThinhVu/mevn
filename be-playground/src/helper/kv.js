const axios = require('axios');
const {execAxios, obj2QryStr, API_URL, readableResp, delay, buildAuthHeaders} = require('./utils');

module.exports = function(user) {
  const headers = buildAuthHeaders(user.token)
  return {
    getAll: () => execAxios(axios.get(`${API_URL}/kv`, headers)),
    getValue: key => execAxios(axios.get(`${API_URL}/kv/${key}`, headers)),
    set: (key, value, isSecret) => execAxios(axios.post(`${API_URL}/kv/${key}`, {value, isSecret}, headers)),
    unset: (key) => execAxios(axios.delete(`${API_URL}/kv/${key}`, headers)),
  }
}
