import {socket} from "@/socket/socket"

export function pipeServerLog() {
  socket.emit('server-log:pipe');
  socket.on('server-log:data', (method, ...args) => console[method](...args));
}

export function unpipeServerLog() {
  socket.emit('server-log:unpipe');
}
