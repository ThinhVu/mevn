require('dotenv').config();
const child_process = require('child_process');
const packageJson = require('./package.json');

const {name, version} = packageJson;
const registry = `your-registry-url`
const imageTag = `${registry}/${name}:${version}.${Date.now()}`

const buildDist = 'npm run build';
const buildDockerImage = `docker build -t ${imageTag} .`;
const pushDockerToRegistry = `docker push ${imageTag}`;

console.log(`Deploying ${imageTag}`)
const buildProcess = child_process.exec(`${buildDist} && ${buildDockerImage} && ${pushDockerToRegistry}`)
buildProcess.stdout.on('data', console.log)
buildProcess.stderr.on('data', console.log)
buildProcess.on('exit', (code, signal) => {
  console.log('on exit', code, signal)
  console.log('image', imageTag)
})
