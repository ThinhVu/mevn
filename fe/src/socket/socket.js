import socketClient from 'socket.io-client'
import {API_URL} from '@/constants.js';

export default function socketConnect(access_token) {
   const url = `${API_URL}?token=${access_token}`;
   console.log('[SocketIO] Connect to', url);
   const socket = socketClient(url);
   socket.on('connect', () => console.log('[Socket] connected to API server!'));
   return socket;
}
