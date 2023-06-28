const User = require('../helper/user')
const KV = require('../helper/kv')
const Hmm = require('../helper/hmm')

async function main() {
  const admin = await User.basicAuth('admin', '3378')
  const kv = KV(admin)
  const hmm = Hmm(admin)

  console.log('secret')
  console.log(await kv.set('PASSWORD', "123", true))
  console.log(await kv.getValue('PASSWORD'))
  console.log(await hmm.kv.findOne({key: 'PASSWORD'}).$)
}

main()

