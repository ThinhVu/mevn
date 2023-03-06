import axios from 'axios';
import {API_URL} from '../../constants';
import notification from '@/components/UiLib/Api/notification';
import {user} from '@/appState';

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
  window.localStorage.setItem('token', token);
  user.value = await userAPI.about('me');
}

export const userAPI = {
  about: async (userId) => exec(() => axios.get(`${API_URL}/users/about/${userId}`, axiosOpts)),
  update: async (change) => exec(() => axios.put(`${API_URL}/users/update-profile`, change, axiosOpts)),
  signUp: async (email, password) => {
    try {
      const rs = await axios.post(`${API_URL}/signup`, {email: email, password: password})
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
      const rs = await axios.post(`${API_URL}/login`, {email, password})
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
      const {data} = (await axios.get(`${API_URL}/auth-user`, {headers: {Authorization: `bearer ${token}`}})).data;
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
}

export const systemAPI = {
  getLogs: async () => (await axios.get(`${API_URL}/logs`)).data,
  getLog: async logFile => (await axios.get(`${API_URL}/log/${logFile}`)).data,
  getLogSetting: async () => (await axios.get(`${API_URL}/logSetting`)).data,
  updateLogSetting: async ({enable, maximumLogLine, keepLogInDays}) => (await axios.post(`${API_URL}/logSetting`, { enable, maximumLogLine, keepLogInDays })).data,
  getApiCallCounter: async () => (await axios.get(`${API_URL}/metric/api-call`)).data,
  getApiCallHistory: async (from, to) => (await axios.get(`${API_URL}/metric/api-call-history?from=${from}&to=${to}`)).data,
  getAppMetric: async () => (await axios.get(`${API_URL}/metric/app`)).data,
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`)
}
