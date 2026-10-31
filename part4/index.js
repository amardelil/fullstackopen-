require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

if (!config.MONGODB_URI) {
  throw new Error('Set MONGODB_URI (and TEST_MONGODB_URI for tests) in .env')
}
if (!process.env.SECRET) {
  throw new Error('Set SECRET in .env')
}

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
    app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`))
  })
  .catch(error => {
    logger.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
