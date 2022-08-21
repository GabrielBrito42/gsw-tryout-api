export default () => {
  const ENV_VARS = {
    port: parseInt(process.env.PORT, 10) || 8080,
    mongodbUrl: process.env.MONGODB_URL,
  }

  const ENV_VARS_PROD = {
    port: parseInt(process.env.PORT, 10) || 8080,
    mongodbUrl: process.env.MONGODB_URL_PROD,
  }

  const TEST_ENV_VARS = {
    port: parseInt(process.env.PORT, 10) || 8080,
    mongodbUrl: 'mongodb://localhost:27017',
  }

  const environments = {
    test: TEST_ENV_VARS,
    development: ENV_VARS,
    production: ENV_VARS
  }

  return environments[process.env.NODE_ENV]
}
