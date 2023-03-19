import axios from 'axios';
import {API_URL} from '@/constants';
import notification from '@/components/UiLib/System/notification';
import {user} from '@/app-state';

function getRespData({data, error}) {
  if (error) {
    throw error
  }
  if (typeof (data) === 'object' && data.data) {
    return data.data
  }
  return data
}

async function exec(asyncFn) {
  try {
    const rs = getRespData(await asyncFn())
    if (window.__debug)
      console.log(rs)
    return rs;
  } catch (e) {
    console.log(e)
  }
}

let axiosOpts = {};

async function _saveAuthSession({token}) {
  axiosOpts = {headers: {Authorization: `bearer ${token}`}};
  window.localStorage.setItem('access_token', token);
  user.value = await userAPI.about('me');
}

export const userAPI = {
  about: async (userId) => exec(() => axios.get(`${API_URL}/user/profile/${userId}`, axiosOpts)),
  update: async (change) => exec(() => axios.put(`${API_URL}/user/profile`, change, axiosOpts)),
  signUp: async (email, password) => {
    try {
      const rs = await axios.post(`${API_URL}/user/sign-up`, {email: email, password: password})
      const {data} = rs.data;
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.error('Token missed!');
      }
      return data.token;
    } catch (e) {
      notification.err(e)
    }
  },
  signIn: async (email, password) => {
    try {
      const rs = await axios.post(`${API_URL}/user/sign-in`, {email, password})
      const {data} = rs.data;
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.log('signIn failed')
      }
      return data.token;
    } catch (e) {
      notification.err(e)
    }
  },
  auth: async token => {
    try {
      const {data} = (await axios.get(`${API_URL}/user/auth`, {headers: {Authorization: `bearer ${token}`}})).data;
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.log('Auth failed')
      }
      return data.token;
    } catch (e) {
      return null;
    }
  },
  signOut: async () => exec(() => axios.post(`${API_URL}/user/sign-out`), {}, axiosOpts)
}

export const systemAPI = {
  getLogs: async () => exec(() => axios.get(`${API_URL}/logs`, axiosOpts)),
  getLog: async logFile => exec(() => axios.get(`${API_URL}/log/${logFile}`, axiosOpts)),
  getLogSetting: async () => exec(() => axios.get(`${API_URL}/log-setting`, axiosOpts)),
  updateLogSetting: async ({enable, maximumLogLine, keepLogInDays}) => exec(() => axios.post(`${API_URL}/log-setting`, { enable, maximumLogLine, keepLogInDays }, axiosOpts)),
  getApiCallCounter: async () => exec(() => axios.get(`${API_URL}/metric/api-call`, axiosOpts)),
  getApiCallHistory: async (from, to) => exec(() => axios.get(`${API_URL}/metric/api-call-history?from=${from}&to=${to}`, axiosOpts)),
  getAppMetric: async () => exec(() => axios.get(`${API_URL}/metric/app`, axiosOpts)),
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`, axiosOpts)
}

export const systemConfigAPI = {
  gets: async () => exec(() => axios.get(`${API_URL}/system-configs`, axiosOpts)),
  get: async key => exec(() => axios.get(`${API_URL}/system-config/${key}`, axiosOpts)),
  set: async (key, value) => exec(() => axios.post(`${API_URL}/system-config/${key}`, { payload: value }, axiosOpts)).then(() => notification.success('Saved')),
  unset: async key => exec(() => axios.delete(`${API_URL}/system-config/${key}`, axiosOpts)),
}
