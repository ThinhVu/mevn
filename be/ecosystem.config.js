module.exports = [{
  script: './dist/index.js',
  name: 'app',
  exec_mode: 'cluster',
  instances: process.env.RUNNING_INSTANCES === undefined ? 0 : +process.env.RUNNING_INSTANCES
}]
