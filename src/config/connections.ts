const dbEnvironments = {
  test: 'mongodb://localhost:27017/test',
  development: process.env.MONGODB_URL,
  production: process.env.MONGODB_URL
}

export { dbEnvironments }
