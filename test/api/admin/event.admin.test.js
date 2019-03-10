process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaihttp = require('chai-http')
const User = require('../../../models/user.model')
const Event = require('../../../models/event.model')
const app = require('../../../app')

chai.use(chaihttp)
var expect = chai.expect

describe('events', () => {

    beforeEach('inserting dummy data for testing', async () => {
        // create user and event
        var user = new User({ username: "johndoe", user_type: 2, profile_picture_url: "/media/user_profile_pictures/test.png" })
        await User.register(user, "password")
    })
    
    afterEach('remove dummy data', async () => {
        // delete database
        await User.find({}).deleteMany()
        await Event.find({}).deleteMany()
    })
    
    it('should list all the events', (done) => {
        chai.request(app).get('/admin/event')
            .end((_, res) => {
                expect(res.statusCode).to.equal(200)
                done()
            })
    })

    it('should add event after authentication', (done) => {
        var agent = chai.request.agent(app)
        agent.post('/login')
            .send({ password: "password", username: "johndoe" })
            .end((_) => {
                agent.post('/admin/event')
                    .send({ 'event_name': 'Lok Sabha', 'event_logo': 'data:image/png;base64,iVBORw0K' })
                    .end((_, res) => {
                        expect(res.statusCode).to.equal(200)
                        done()
                    })
            })
    })

    it('should add single parameter of event and pass.', (done) => {
        var agent = chai.request.agent(app)
        agent.post('/login')
            .send({ password: "password", username: "johndoe" })
            .end((_) => {
                agent.post('/admin/event')
                    .send({ 'event_name': 'Lok Sabha' })
                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200)
                        done()
                    })
            })
    })

    it('should try to add events without authentication and fail', (done) => {
        chai.request(app).post('/admin/event')
            .send({ 'event_name': 'Lok Sabha', 'event_logo': "data:image/png;base64,iVBORw0K" })
            .end((_, res) => {
                expect(res.statusCode).to.equal(403)
                done()
            })

    })

    it('should add event after authentication and update', (done) => {
        var agent = chai.request.agent(app)
        agent.post('/login')
            .send({ password: "password", username: "johndoe" })
            .end((_) => {
                agent.post('/admin/event')
                    .send({ 'event_name': 'Lok Sabha', 'event_logo': "data:image/png;base64,iVBORw0K" })
                    .end((err, res) => {
                        agent.post('/admin/event')
                            .send({ 'event_name': 'Rajya Sabha' })
                            .end((err, res) => {
                                expect(res.statusCode).to.equal(200)
                                done()

                            })
                    })
            })
    })

    it('should try to update event without authentication and fail', (done) => {
        chai.request(app).post('/admin/event')
            .send({ 'event_name': 'Lok Sabha', 'event_logo': "data:image/png;base64,iVBORw0K" })
            .end((_, res) => {
                expect(res.statusCode).to.equal(403)
                done()
            })

    })
})
