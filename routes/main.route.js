const express = require('express')
const router = express.Router()
const util = require('./util.route')
const main_controller = require('../controllers/main.controller')

router.get('/', util.isAuthenticated, main_controller.index)
router.post('/login', main_controller.login)
router.get('/login', util.isNotAuthenticated, main_controller.login_page)
router.post('/signup', main_controller.signup)
router.get('/signup', util.isNotAuthenticated, main_controller.signup_page)
router.get('/logout', main_controller.logout)

module.exports = router