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
  about: async (userId) => exec(() => axios.get(`${API_URL}/user/profile/0.0.1/${userId}`, axiosOpts)),
  update: async (change) => exec(() => axios.put(`${API_URL}/user/profile/0.0.1/`, change, axiosOpts)),
  signUp: async (email, password) => {
    try {
      const {data} = await axios.post(`${API_URL}/user/sign-up/0.0.1/`, {email: email, password: password})
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
      const {data} = await axios.post(`${API_URL}/user/sign-in/0.0.1/`, {email, password})
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
      const {data} = await axios.get(`${API_URL}/user/auth/0.0.1/`, {headers: {Authorization: `bearer ${token}`}});
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
  signOut: async () => exec(() => axios.post(`${API_URL}/user/sign-out/0.0.1/`), {}, axiosOpts)
}

export const systemAPI = {
  getLogs: async () => exec(() => axios.get(`${API_URL}/log`, axiosOpts)),
  getLog: async logFile => exec(() => axios.get(`${API_URL}/log/file/${logFile}`, axiosOpts)),
  getLogSetting: async () => exec(() => axios.get(`${API_URL}/log/setting`, axiosOpts)),
  updateLogSetting: async ({enable, maximumLogLine, keepLogInDays}) => exec(() => axios.post(`${API_URL}/log/setting`, { enable, maximumLogLine, keepLogInDays }, axiosOpts)),
  getApiCallCounter: async () => exec(() => axios.get(`${API_URL}/system-metric/api-call`, axiosOpts)),
  getApiCallHistory: async (from, to) => exec(() => axios.get(`${API_URL}/system-metric/api-call-history?from=${from}&to=${to}`, axiosOpts)),
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`, axiosOpts)
}

export const systemConfigAPI = {
  gets: async () => exec(() => axios.get(`${API_URL}/system-config`, axiosOpts)),
  get: async key => exec(() => axios.get(`${API_URL}/system-config/${key}`, axiosOpts)),
  set: async (key, value) => exec(() => axios.post(`${API_URL}/system-config/${key}`, { payload: value }, axiosOpts)).then(() => notification.success('Saved')),
  unset: async key => exec(() => axios.delete(`${API_URL}/system-config/${key}`, axiosOpts)),
}
