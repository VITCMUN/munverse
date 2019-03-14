const mongoose = require('mongoose')
const Message = require('./models/message.model')

db_url = "mongodb://localhost:27017/munverse"

mongoose.connect(db_url, { useCreateIndex: true, useNewUrlParser: true })
mongoose.Promise = global.Promise

let db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))

Message.find({ 'sender.username': "India" })
    .distinct('receiver')
    .exec((err, users) => {
        console.log(users)
    })