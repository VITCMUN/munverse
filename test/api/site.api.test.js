process.env.NODE_ENV = 'test'

const chai  = require('chai')
const chai_http = require('chai-http')
const app = require('../../app')

chai.should()
chai.use(chai_http)

describe('Server status', ()=> {
    it('responds with 200 if server is running', () => {
        return chai.request(app)
            .get(`/server-status`)
            .then(res => {
                res.should.have.status(200)
            })
    })
})