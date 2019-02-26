process.env.NODE_ENV = 'test'

const chai = require('chai')
const sanitize = require('../../utils/sanitize')

describe('sanity: validname', () => {
    it('check with valid names', () => {
        chai.assert.isTrue(sanitize.validname("john doe"))
        chai.assert.isTrue(sanitize.validname("johndoe"))
        chai.assert.isTrue(sanitize.validname("JohnDoe"))
        chai.assert.isTrue(sanitize.validname("John Doe"))
        chai.assert.isTrue(sanitize.validname("john jane doe"))
        chai.assert.isTrue(sanitize.validname("John Jane Doe"))
    })
    it('check with invalid names', () => {
        chai.assert.isNotTrue(sanitize.validname("john doe123"))
        chai.assert.isNotTrue(sanitize.validname("john_doe_"))
        chai.assert.isNotTrue(sanitize.validname("john!doe"))
        chai.assert.isNotTrue(sanitize.validname("john321"))
        chai.assert.isNotTrue(sanitize.validname("john@doe"))
        chai.assert.isNotTrue(sanitize.validname("john$doe"))
    })
})