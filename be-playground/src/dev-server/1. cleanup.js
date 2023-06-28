const devServer = require('../helper/dev-server')

async function main() {
  // clear everything and init 1000 users
  await devServer.cleanup()
}

main()
