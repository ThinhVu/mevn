const createHmm = require('../helper/hmm')
const User = require('../helper/user');

async function main() {
  const u = await User.basicAuth('admin', '3378')
  const hmm = createHmm(u)
  console.log('get 1st user', await hmm.user.find().skip(5).limit(1).$)

  console.log('create new announcement')
  console.log(await hmm.announcement.create({content: 'Api playground added', at: new Date()}).$)

  console.log('query all announcement')
  console.log(await hmm.announcement.find().$)
}

main()
