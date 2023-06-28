const {connectSocket} = require('../helper/user')

async function main() {
  const data = await connectSocket(1)
  const {user, token, socket} = data
  console.log(user, token)
  socket.on('__TEST__', () => {
    console.log('received: __TEST__')
  })
}

main()
