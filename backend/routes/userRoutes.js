const express = require('express');
const router = express.Router();
const {
	registerUser,
	updateUser,
	loginUser,
	getMe,
	getUserDataById,
	userSettings,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/user/:id', protect, getUserDataById);
router.put('/settings', protect, userSettings);
router.route('/account').put(protect, upload.single('photo'), updateUser);

module.exports = router;
