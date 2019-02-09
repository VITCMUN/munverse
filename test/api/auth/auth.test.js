process.env.NODE_ENV = 'test'
const mocha = require('mocha')
const chai = require('chai')
const chaihttp =require('chai-http')
const request = require('supertest')
const auth_controller =require('../../../controllers/auth.controller')
const auth_route =require('../../../routes/auth.route')
const middleware=require('../../../middlewares/auth.middleware')
const User = require('../../../models/user.model')
const logger = require('../../.././utils/logger')

var app = require('../../../app')
chai.use(chaihttp)
var expect = chai.expect;
beforeEach('inserting dummy data for testing',()=>{
var user = new User({username:"shantanu",user_typ:0})

 User.register(user,"1234",(err, user) => {
    if(err){
        logger.error('A user with given credentials exists')
    }
    else{
        passport.authenticate('local')(req, res, function(){
            logger.info('New user successfully signed up'+user.username)
        })
    }
})
})

describe('login',()=>{
  it('login', (done)=>{
    User.findOne({username:"shantanu"},(err, post)=> {
    chai.request(app)
      .post('/login')
      .send({ password: "1234", username:"shantanu" })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })
}).timeout(5000)
})
describe("signup",()=>{
it('signup',(done)=>{
  chai.request(app).
  post('/signup')
  .send({ password: "1234", username:"shantanu" })
  .end((err,res)=>{
    expect(res).to.have.status(304)
    done()
  })
})
it('signup failure', (done)=>{
  User.findOne({}, {}, { sort: { 'created_at' : -1 } },(err, post)=> {
  chai.request(app)
    .post('/signup')
    .send({ password: "1234", username: post['username'] })
    .end((err, res) => {
      expect((res)=>{
        return res==200 || res==304
      })
      done()
    })
})
}).timeout(5000)
})
describe("logout",()=>{
  it('should redirect to main page if logged out',(done)=>{
    request(app)
    .get('/logout')
    .expect('Location', '/')
    .end(done)
  })
})
