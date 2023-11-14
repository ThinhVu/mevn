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
  about: async (userId) => exec(() => axios.get(`${API_URL}/api/user/profile/${userId}`, axiosOpts)),
  update: async (change) => exec(() => axios.put(`${API_URL}/api/user/profile`, change, axiosOpts)),
  signUp: async (email, password) => {
    try {
      const {data} = await axios.post(`${API_URL}/api/user/sign-up/`, {email: email, password: password})
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
      const {data} = await axios.post(`${API_URL}/api/user/sign-in/`, {email, password})
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
      const {data} = await axios.get(`${API_URL}/api/user/auth/`, {headers: {Authorization: `bearer ${token}`}});
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
  signOut: async () => exec(() => axios.post(`${API_URL}/api/user/sign-out/`), {}, axiosOpts)
}

export const systemAPI = {
  getApiCallCounter: async () => exec(() => axios.get(`${API_URL}/api/api-metric/`, axiosOpts)),
  getApiCallHistory: async (from, to) => exec(() => axios.get(`${API_URL}/api/api-metric/history?from=${from}&to=${to}`, axiosOpts)),
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`, axiosOpts)
}

export const kvAPI = {
  gets: async () => exec(() => axios.get(`${API_URL}/api/kv`, axiosOpts)),
  get: async key => exec(() => axios.get(`${API_URL}/api/kv/${key}`, axiosOpts)),
  set: async (key, value, isSecret) => exec(() => axios.post(`${API_URL}/api/kv/${key}`, {value, isSecret}, axiosOpts)),
  unset: async key => exec(() => axios.delete(`${API_URL}/api/kv/${key}`, axiosOpts)),
}

export const feAPI = {
  folder: {
    create: async (name, parent) => exec(() => axios.post(`${API_URL}/api/folder`, {name, parent}, axiosOpts)),
    update: async (id, change) => exec(() => axios.put(`${API_URL}/api/folder/${id}`, change, axiosOpts)),
    remove: async (id) => exec(() => axios.delete(`${API_URL}/api/folder/${id}`, axiosOpts)),
    getFolderTree: async () => exec(() => axios.get(`${API_URL}/api/folder`, axiosOpts)),
    getFiles: async (folderId) => exec(() => axios.get(`${API_URL}/api/folder/${folderId}`, axiosOpts)),
    addFileToFolder: async (folderId, fileId) => exec(() => axios.post(`${API_URL}/api/folder/add-file`, {folderId, fileId}, axiosOpts)),
    removeFileFromFolder: async (folderId, fileId) => exec(() => axios.post(`${API_URL}/api/folder/remove-file`, {folderId, fileId}, axiosOpts)),
  },
  file: {
    create: async (item, folderId) => exec(() => axios.post(`${API_URL}/api/file`, {...item, folderId}, axiosOpts)),
    update: async (fileId, change) => exec(() => axios.put(`${API_URL}/api/file/${fileId}`, {change}, axiosOpts)),
    remove: async (fileId, folderId) => exec(() => axios.delete(`${API_URL}/api/file/${fileId}?folderId=${folderId}`, axiosOpts))
  }
}
