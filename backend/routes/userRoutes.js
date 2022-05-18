const express = require('express')
const router = express.Router()
const { 
    registerUser, 
    loginUser, 
    getMe, 
    userSettings,
} = require('../controllers/userController')
 
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/settings', protect, userSettings)

module.exports = router