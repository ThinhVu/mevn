import 'hmm/src/builder'
import axios from 'axios'
import jsonFn from 'json-fn'
import {HMM_API_URL} from '@/constants'
const getOpts = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }})
const hmm = HmmBuilder(async payload => {
  try {
    const {data} = await axios.post(HMM_API_URL, jsonFn.stringify(payload), getOpts())
    return data
  } catch (e) {
    console.error(e)
    const errMsg = e.response.data.error
    console.error(errMsg)
  }
})
window.hmm = hmm
export default hmm
