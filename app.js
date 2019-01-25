const express = require('express')
const app = express()
var path = require('path')
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))  

// db connections
const mongoose = require("mongoose")
var Schema = mongoose.Schema
const db_url = "mongodb://kunal:sahni1@ds161794.mlab.com:61794/mongoose"
mongoose.connect(db_url,{useNewUrlParser:true})
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))
const User = require("./models/user.model")


const http = require('http')
var server = http.createServer(app)
var io = require('socket.io')(server)

//if(User){console.log("model found!")}
//app.use(express.static(__dirname))

// set the templating engine
app.set("view engine","ejs")

// for handling routes
require('./routes/routes.js')(app, io)



server.listen(3000, function () {
  console.log('SocketChat started on port 3000!')
});

