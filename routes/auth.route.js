const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/auth.middleware')
const auth_controller = require('../controllers/auth.controller')

router.get('/', middleware.is_authenticated, auth_controller.home_view)
router.post('/login', auth_controller.login)
router.get('/login', auth_controller.login_view)
router.get('/logout', auth_controller.logout)
router.post('/signup', auth_controller.signup)
module.exports = router
