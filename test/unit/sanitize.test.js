process.env.NODE_ENV = 'test'

const chai = require('chai')
const sanitize = require('../../utils/sanitize')

describe('sanity: valid_name', () => {
    it('check with valid names', () => {
        chai.assert.isTrue(sanitize.valid_name("john doe"))
        chai.assert.isTrue(sanitize.valid_name("johndoe"))
        chai.assert.isTrue(sanitize.valid_name("JohnDoe"))
        chai.assert.isTrue(sanitize.valid_name("John Doe"))
        chai.assert.isTrue(sanitize.valid_name("john jane doe"))
        chai.assert.isTrue(sanitize.valid_name("John Jane Doe"))
    })
    it('check with invalid names', () => {
        chai.assert.isNotTrue(sanitize.valid_name("john doe123"))
        chai.assert.isNotTrue(sanitize.valid_name("john_doe_"))
        chai.assert.isNotTrue(sanitize.valid_name("john!doe"))
        chai.assert.isNotTrue(sanitize.valid_name("john321"))
        chai.assert.isNotTrue(sanitize.valid_name("john@doe"))
        chai.assert.isNotTrue(sanitize.valid_name("john$doe"))
    })
})