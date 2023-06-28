const {login, getMyInfo} = require('../helper/user')

async function main() {
  const data = await login(1)
  console.log(data)
  const myInfo = await getMyInfo(data)
  console.log('myInfo', myInfo)
}

main()
