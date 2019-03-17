const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/auth.middleware')
const event_admin_controller = require('../controllers/admin/event.admin.controller')
const council_admin_controller = require('../controllers/admin/council.admin.controller')
const user_admin_controller = require('../controllers/admin/user.admin.controller')

router.get('/event', event_admin_controller.get_event)
router.post('/event', middleware.is_admin, event_admin_controller.add_or_update_event)
router.get('/users', middleware.is_authenticated, user_admin_controller.get_users)
router.post('/user', middleware.is_admin, user_admin_controller.add_user)
router.put('/user', middleware.is_admin, user_admin_controller.update_user)
router.delete('/user', middleware.is_admin, user_admin_controller.delete_user)
router.get('/council', council_admin_controller.get_council)
router.post('/council', middleware.is_admin, council_admin_controller.add_or_update_council)

module.exports = router