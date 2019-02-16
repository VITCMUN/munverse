process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaihttp = require('chai-http')
const User = require('../../../models/user.model')
const app = require('../../../app')

chai.use(chaihttp)
var expect = chai.expect;

beforeEach('inserting dummy data for testing', async () => {
  var user = new User({ username: "johndoe", user_type: 0 })
  await User.register(user, "password")
})

afterEach('remove dummy data', async () => {
  await User.deleteMany({})
})

describe('login', () => {
  it('login normally with right username and password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ password: "password", username: "johndoe" })
      .end((_, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })
  it('login incorrectly with no username and password', (done) => {
    chai.request(app)
      .post('/login')
      .end((_, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })
  it('login incorrectly with wrong username and password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ password: "password1", username: "johndooe" })
      .end((_, res) => {
        expect(res).to.have.status(401)
        done()
      })
  })
  it('login incorrectly with right username and wrong password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ password: "password1", username: "johndoe" })
      .end((_, res) => {
        expect(res).to.have.status(401)
        done()
      })
  })
})

describe("logout", () => {
  it('logout after logging in', (done) => {
    var agent = chai.request.agent(app)
    agent.post('/login')
      .send({ password: "password", username: "johndoe" })
      .end((_) => {
        agent.get('/logout')
          .end((_, res) => {
            expect(res).to.have.status(200)
            done()
          })
      })
  })
  it('logout before logging in', (done) => {
    chai.request(app)
      .get('/logout')
      .end((_, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })
})
