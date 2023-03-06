export const BE_URL = process.env.NODE_ENV === 'production' ? process.env.API_URL || 'https://your-domain' : 'http://localhost:3000';
export const API_URL = `${BE_URL}/api`
export const HMM_API_URL = `${BE_URL}/hmm-api`
export const FILE_API_URL = 'https://your-file-api-server' // : 'http://localhost:8081/api';

