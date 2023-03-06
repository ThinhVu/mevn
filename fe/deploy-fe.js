const child_process = require('child_process');
const packageJson = require('./package.json')
const {name, version} = packageJson
const buildId = `${name}:${version}.${new Date().getTime()}`
const DOCKER_REGISTRY = '{your registry server}'
const imgTag = `${DOCKER_REGISTRY}/${buildId}`
const buildProcesses = [
  `docker build -t ${imgTag} .`,
  `docker push ${imgTag}`
]
const process = child_process.exec(buildProcesses.join(' && '))
process.stdout.on('data', console.log)
process.stderr.on('data', console.log)
process.on('exit', (code, signal) => {
  console.log('on exit', code, signal)
  console.log(imgTag)
})
