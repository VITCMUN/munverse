const winston = require('winston')
const config = require('../config')

const transports = [
  new winston.transports.File(
    {
      level: 'error',
      filename: config.error_log_file
    })
]

if (process.env.NODE_ENV !== 'test'){
  transports.push(new winston.transports.Console({level: 'info'}))
}

const logger = winston.createLogger({transports})

module.exports = logger