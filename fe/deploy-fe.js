require('dotenv').config();
const child_process = require('child_process');
const packageJson = require('./package.json');

const {name, version} = packageJson;
const imageTag = `${process.env.DOCKER_REGISTRY}/${name}:${version}.${Date.now()}`

const buildDist = 'npm run build';
const buildDockerImage = `docker build -t ${imageTag} .`;
const pushDockerToRegistry = `docker push ${imageTag}`;

console.log(`Deploying ${imageTag}`)
const process = child_process.exec(`${buildDist} && ${buildDockerImage} && ${pushDockerToRegistry}`)
process.stdout.on('data', console.log)
process.stderr.on('data', console.log)
process.on('exit', (code, signal) => {
  console.log('on exit', code, signal)
  console.log('image', imageTag)
})
