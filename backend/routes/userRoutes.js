const express = require('express')
const router = express.Router()
const { 
    registerUser, 
    loginUser, 
    getMe, 
    getUserDataById, 
    userSettings,
} = require('../controllers/userController')
 
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/user/:id', protect, getUserDataById)
router.put('/settings', protect, userSettings)

module.exports = router