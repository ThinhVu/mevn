require('dotenv').config();
const child_process = require('child_process');
const packageJson = require('./package.json');

const {name, version} = packageJson;
const registry = '{your-registry-url}'
const imageTag = `${registry}/${name}:${version}.${Date.now()}`;

const cmds = [
  `docker build -t ${imageTag} .`,
  `docker push ${imageTag}`
]

console.log(`Deploying ${imageTag}`);
const buildProcess = child_process.exec(cmds.join(' && '));
buildProcess.stdout.on('data', console.log)
buildProcess.stderr.on('data', console.log)
buildProcess.on('exit', (code, signal) => {
  console.log('on exit', code, signal)
  console.log(imageTag)
})
