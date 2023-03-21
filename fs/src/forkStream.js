const through2 = require('through2');

module.exports = function(streams) {
  const forkStream = through2(function (chunk, enc, callback) {
    for (const stream of streams) {
      try {
        stream.write(chunk)
      } catch (e) {
        console.error(e, 'write chunk error')
      }
    }

    this.push(chunk);
    callback();
  })

  forkStream.on('error', e => {
    console.error(e, '[forkStream] on error')
    forkStream.end();
  })

  forkStream.on('finish', () => {
    console.log('[forkStream] finish')
    for (const stream of streams)
      stream.end();
    forkStream.end();
  })

  return forkStream
}
