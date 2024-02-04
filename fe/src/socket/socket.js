import socketClient from 'socket.io-client'
import {WS_URL} from '@/constants.js';

export let socket;

export function socketConnect(access_token) {
   const url = `${WS_URL}/admin?token=${access_token}`;
   console.log('[SocketIO] Connect to', url);
   socket = socketClient(url, {transports: ['websocket']});
   socket.on('connect', () => console.log('[Socket] connected to API server!'));
}
