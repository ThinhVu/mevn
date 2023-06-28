const hmmBuilderFactory = require('@tvux/hmmjs/src/builder')
const axios = require('axios');
const JSONfn = require('json-fn')
const {buildAuthHeaders} = require('./utils');

// note that: for some reason, hmm can only run in browser env
// navigate to@tvux/hmmjs/src/builder file, comment window stuff
//

module.exports = function (user) {
  const headers = buildAuthHeaders(user.token)
  const send = async payload => (await axios.post(`http://localhost:4000/hmm`, JSONfn.stringify(payload), headers)).data
  return hmmBuilderFactory(send)
}
