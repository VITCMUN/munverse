const config = require('./config')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')

const app = express()

// set up
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
}

app.get('/server-status', (req, res) => {
    res.status(200).send('Server is up!')
})

// start the server
app.listen(config.port, '0.0.0.0', ()=>{
    logger.info(`munverse started on ${config.port}`)
})

// expose to the test suite
module.exports = app