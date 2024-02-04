import axios from 'axios';
import {API_URL} from '@/constants';
import {user as appUser} from '@/app-state';

function getRespData({data, error}) {
  if (error) {
    throw error
  }
  if (typeof (data) === 'object' && data.data) {
    return data.data
  }
  return data
}

async function exec(promise) {
  try {
    const rs = getRespData(await promise)
    if (window.__debug)
      console.log(rs.data)
    return rs;
  } catch (e) {
    console.log(e)
  }
}

let axiosOpts = {};

async function _saveAuthSession({user, token}) {
  axiosOpts = {headers: {Authorization: `bearer ${token}`}};
  window.localStorage.setItem('access_token', token);
  appUser.value = user
}

export const userAPI = {
  signIn: async (email, password) => {
    try {
      const data = await exec(axios.post(`${API_URL}/admin/sign-in`, {email, password}))
      console.log('data', data)
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
      const data = await exec(axios.get(`${API_URL}/admin/auth`, {headers: {Authorization: `bearer ${token}`}}));
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
  signOut: async () => exec(axios.post(`${API_URL}/admin/sign-out`), {}, axiosOpts)
}

export const systemAPI = {
  getDAUHistory: async (from, to) => exec(axios.get(`${API_URL}/user-metric/dau/history?from=${from}&to=${to}`, axiosOpts)),
  getWAUHistory: async (from, to) => exec(axios.get(`${API_URL}/user-metric/wau/history?from=${from}&to=${to}`, axiosOpts)),
  getMAUHistory: async (from, to) => exec(axios.get(`${API_URL}/user-metric/mau/history?from=${from}&to=${to}`, axiosOpts)),
  getAppMetric: async () => exec(axios.get(`${API_URL}/app-metric`, axiosOpts)),
  getAppMetricHistory: async (from, to) => exec(axios.get(`${API_URL}/app-metric/history?from=${from}&to=${to}`, axiosOpts)),
  getApiCallCounter: async () => exec(axios.get(`${API_URL}/api-metric`, axiosOpts)),
  getApiCallHistory: async () => exec(axios.get(`${API_URL}/api-metric/history`, axiosOpts)),
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`, axiosOpts)
}

export const kvAPI = {
  gets: async () => exec(axios.get(`${API_URL}/kv`, axiosOpts)),
  get: async key => exec(axios.get(`${API_URL}/kv/${key}`, axiosOpts)),
  set: async (key, value, isSecret) => exec(axios.post(`${API_URL}/kv/${key}`, {value, isSecret}, axiosOpts)),
  unset: async key => exec(axios.delete(`${API_URL}/kv/${key}`, axiosOpts)),
}

export const feAPI = {
  folder: {
    create: async (name, parent) => exec(axios.post(`${API_URL}/folder`, {name, parent}, axiosOpts)),
    update: async (id, change) => exec(axios.put(`${API_URL}/folder/${id}`, change, axiosOpts)),
    remove: async (id) => exec(axios.delete(`${API_URL}/folder/${id}`, axiosOpts)),
    getFolderTree: async () => exec(axios.get(`${API_URL}/folder`, axiosOpts)),
    getFiles: async (folderId) => exec(axios.get(`${API_URL}/folder/${folderId}`, axiosOpts)),
    addFileToFolder: async (folderId, fileId) => exec(axios.post(`${API_URL}/folder/add-file`, {folderId, fileId}, axiosOpts)),
    removeFileFromFolder: async (folderId, fileId) => exec(axios.post(`${API_URL}/folder/remove-file`, {folderId, fileId}, axiosOpts)),
  },
  file: {
    uploadForm: async (fileName, mimeType) => exec(axios.get(`${API_URL}/file/upload-form?fileName=${fileName}&mimeType=${mimeType}`, axiosOpts)),
    create: async (item, folderId) => exec(axios.post(`${API_URL}/file`, {...item, folderId}, axiosOpts)),
    update: async (fileId, change) => exec(axios.put(`${API_URL}/file/${fileId}`, {change}, axiosOpts)),
    remove: async (fileId, folderId) => exec(axios.delete(`${API_URL}/file/${fileId}?folderId=${folderId}`, axiosOpts))
  }
}
