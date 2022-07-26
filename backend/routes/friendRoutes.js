const express = require('express');
const router = express.Router();
const {
	getFriendsDataById,
	getFriendSuggestions,
	getAllUserFriends,
	getUserFriends,
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	unFriendRequest,
} = require('../controllers/friendController');

const { protect } = require('../middleware/authMiddleware');

router.get('/friend/:id', protect, getFriendsDataById);
router.get('/suggestions', protect, getFriendSuggestions);
router.get('/allfriends', protect, getAllUserFriends);
router.get('/allfriends/:id', protect, getAllUserFriends);
router.route('/').get(protect, getUserFriends);
router.post('/request', protect, sendFriendRequest);
router.put('/accept', protect, acceptFriendRequest);
router.put('/reject', protect, rejectFriendRequest);
router.put('/unfriend', protect, unFriendRequest);

module.exports = router;
