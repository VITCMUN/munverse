const { createLogger, format, transports } = require('winston')
const { combine, colorize, printf } = format
const moment = require('moment-timezone')
const config = require('../config')

const log_format = printf(info => {
  return `(${info.timestamp}) [${info.level}] ${JSON.stringify(info.message)}`
})

const timestamp = format((info) => {
  info.timestamp = moment().tz('Asia/Kolkata').format('MMM Do YYYY h:m:s A z')
  return info
})

const transports_list = [
  new transports.File(
    {
      level: 'error',
      filename: config.error_log_file
    }),
  new transports.File(
    {
      level: 'debug',
      filename: config.debug_log_file
    })
]

if (process.env.NODE_ENV !== 'test') {
  transports_list.push(new transports.Console({ level: 'info' }))
}

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    log_format
  ),
  transports: transports_list
})

module.exports = logger