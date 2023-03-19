import socketClient from 'socket.io-client'
import {API_URL} from '@/constants.js';

export default function socketConnect(app, access_token) {
   const socket = socketClient(`${API_URL}?token=${access_token}`);
   socket.on('connect', (args) => console.log('[Socket] connected to API server!', args));
   return socket;
}
