const config = require('./config')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user.model')
const logger = require('./utils/logger')
const auth_route = require('./routes/auth.route')
const admin_route = require('./routes/admin.route')
const message_route = require('./routes/message.route')
const db = require('./db/db')
const socket = require('socket.io')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('media'))
app.use(bodyParser.json({limit: "5mb"}))
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }))

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan("dev"))
}

db.init()

app.use(session({
    secret: 'Silicon Valley',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(auth_route)
app.use('/admin', admin_route)
app.use('/message', message_route.router)
app.use('/threads',message_route.router)

app.get('/server-status', (req, res) => {
    res.status(200).send('Server is up!')
})

// start the server
const server = app.listen(config.port, '0.0.0.0', () => {
    logger.info(`munverse started on ${config.port}`)
})

var io = socket(server)
message_route.io(io)

// expose to the test suite
module.exports = app

