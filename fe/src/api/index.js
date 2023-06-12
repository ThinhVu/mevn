import axios from 'axios';
import {API_URL} from '@/constants';
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
      const {data} = await axios.post(`${API_URL}/user/sign-up/`, {email: email, password: password})
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.error('Token missed!');
      }
      return data.token;
    } catch (e) {
      console.error(e)
    }
  },
  signIn: async (email, password) => {
    try {
      const {data} = await axios.post(`${API_URL}/user/sign-in/`, {email, password})
      if (data.token) {
        await _saveAuthSession(data);
      } else {
        console.log('signIn failed')
      }
      return data.token;
    } catch (e) {
      console.error(e)
    }
  },
  auth: async token => {
    try {
      const {data} = await axios.get(`${API_URL}/user/auth/`, {headers: {Authorization: `bearer ${token}`}});
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
  signOut: async () => exec(() => axios.post(`${API_URL}/user/sign-out/`), {}, axiosOpts)
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

export const kvAPI = {
  gets: async () => exec(() => axios.get(`${API_URL}/kv`, axiosOpts)),
  get: async key => exec(() => axios.get(`${API_URL}/kv/${key}`, axiosOpts)),
  set: async (key, value, isSecret) => exec(() => axios.post(`${API_URL}/kv/${key}`, {value, isSecret}, axiosOpts)),
  unset: async key => exec(() => axios.delete(`${API_URL}/kv/${key}`, axiosOpts)),
}

export const feAPI = {
  folder: {
    create: async (name, parent) => exec(() => axios.post(`${API_URL}/file-system/folder`, {name, parent}, axiosOpts)),
    update: async (id, change) => exec(() => axios.put(`${API_URL}/file-system/folder/${id}`, change, axiosOpts)),
    remove: async (id) => exec(() => axios.delete(`${API_URL}/file-system/folder/${id}`, axiosOpts)),
    getFolderTree: async () => exec(() => axios.get(`${API_URL}/file-system/folder`, axiosOpts)),
    getFiles: async (folderId) => exec(() => axios.get(`${API_URL}/file-system/folder/${folderId}`, axiosOpts)),
    addFileToFolder: async (folderId, fileId) => exec(() => axios.post(`${API_URL}/file-system/folder/add-file`, {folderId, fileId}, axiosOpts)),
    removeFileFromFolder: async (folderId, fileId) => exec(() => axios.post(`${API_URL}/file-system/folder/remove-file`, {folderId, fileId}, axiosOpts)),
  },
  file: {
    create: async (item, folderId) => exec(() => axios.post(`${API_URL}/file-system/file`, {...item, folderId}, axiosOpts)),
    update: async (fileId, change) => exec(() => axios.put(`${API_URL}/file-system/file/${fileId}`, {change}, axiosOpts)),
    remove: async (fileId, folderId) => exec(() => axios.delete(`${API_URL}/file-system/file/${fileId}?folderId=${folderId}`, axiosOpts))
  }
}
