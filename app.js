const config = require('./config')
const morgan = require('morgan')
const express = require('express')
const logger = require('/utils/logger')

const app = express()
var path = require('path')
const bodyParser = require("body-parser")

// set-up
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))  

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
}

// db connections
const mongoose = require("mongoose")
const db_url = "mongodb://kunal:sahni1@ds161794.mlab.com:61794/mongoose"
mongoose.connect(db_url,{useNewUrlParser:true})
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))
const User = require("./models/user.model")


// server setup
const http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)



// set the templating engine
app.set("view engine","ejs")

// for handling routes
require('./routes/routes.js')(app, io)



server.listen(config.port,  () =>{
   logger.info(`munverse started on ${config.port}`)
})

module.exports = app
