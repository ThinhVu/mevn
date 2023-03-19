export function pipeServerLog() {
  window.$socket.emit('server-log:pipe');
  window.$socket.on('server-log:data', (method, ...args) => console[method](...args));
}

export function unpipeServerLog() {
  window.$socket.emit('server-log:unpipe');
}
