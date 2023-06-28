const {login} = require('../helper/user')

async function main() {
   const data = await login(1)
   console.log(data)
}

main()
