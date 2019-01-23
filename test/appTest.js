//MOCHA/CHAI tester for DB connection success

//https://blog.bitsrc.io/build-a-unit-testing-suite-with-mocha-and-mongoose-eba06c3b3625
//Above link has been referred to for building testing codes
const mocha=require('mocha')
const assert=require('chai').assert;


const mongoose = require('mongoose');

//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/munverse');
mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ',error);
    });
