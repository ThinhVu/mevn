import axios from 'axios';
import {API_URL} from '@/constants';

export default {
  getLogs: async () => (await axios.get(`${API_URL}/logs`)).data,
  getLog: async logFile => (await axios.get(`${API_URL}/log/${logFile}`)).data,
  getLogSetting: async () => (await axios.get(`${API_URL}/logSetting`)).data,
  updateLogSetting: async ({enable, maximumLogLine, keepLogInDays}) => (await axios.post(`${API_URL}/logSetting`, { enable, maximumLogLine, keepLogInDays })).data,
  getApiCallCounter: async () => (await axios.get(`${API_URL}/metric/api-call`)).data,
  getApiCallHistory: async (from, to) => (await axios.get(`${API_URL}/metric/api-call-history?from=${from}&to=${to}`)).data,
  getAppMetric: async () => (await axios.get(`${API_URL}/metric/app`)).data,
  healthCheck: async api_url => await axios.get(`${api_url}/health-check`)
}
