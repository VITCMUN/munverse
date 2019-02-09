process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaihttp = require('chai-http')
const request = require('supertest')
const User = require('../../../models/user.model')
const app = require('../../../app')

chai.use(chaihttp)
var expect = chai.expect;

before('inserting dummy data for testing', async () => {
  var user = new User({ username: "johndoe", user_type: 0 })
  await User.register(user, "password")
})

after('remove dummy data', async () => {
  await User.deleteMany({})
})

describe('login', () => {
  it('login normally with right username and password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ password: "password", username: "johndoe" })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  }).timeout(5000)
})

describe("signup", () => {
  it('signup with existing username and password', (done) => {
    chai.request(app).
      post('/signup')
      .send({ password: "password", username: "johndoe", user_type: 0 })
      .end((err, res) => {
        expect(res.status).to.be.equal(403)
        done()
      })
  })
  it('signup with new username and password', (done) => {
      chai.request(app)
        .post('/signup')
        .send({ password: "password", username: "jandoe", user_type: 0 })
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200, 304])
          done()
        })
  }).timeout(5000)
})

describe("logout", () => {
  it('should redirect to main page if logged out', (done) => {
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .end(done)
  })
})
