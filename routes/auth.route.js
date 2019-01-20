const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/auth.middleware')
const main_controller = require('../controllers/auth.controller')

router.get('/admin', middleware.isadmin, main_controller.admin)
router.get('/', middleware.isAuthenticated, main_controller.index)
router.post('/login', main_controller.login)
router.get('/login', middleware.isNotAuthenticated, main_controller.login_page)
router.post('/signup', main_controller.signup)
router.get('/signup', middleware.isNotAuthenticated, main_controller.signup_page)
router.get('/logout', main_controller.logout)

module.exports = router
