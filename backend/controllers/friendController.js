const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Friend = require('../models/friendModel');
const User = require('../models/userModel');

// @desc    Get friends list
// @route   GET /api/friends/allfriends
// @access  Private
const getUserFriends = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const userData = await User.findById(req.user._id);

	res.status(200).json(userData.friends);
});

// @desc    Get friends list
// @route   GET /api/friends/allfriends/:id
// @access  Private
const getAllUserFriends = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	var userData;
	var userList;

	if (req.params.id) {
		userData = await User.findById(req.params.id);
		userList = await User.find();
	} else {
		userData = await User.findById(req.user._id);
		// Get all the user except the logged in user
		userList = await User.find({ _id: { $ne: req.user._id } });
	}

	const userFriendsData = await Friend.find({ _id: { $in: userData.friends } });

	var allFriendsList = userList.map((data) => {
		var newData;
		userFriendsData.map((friendData) => {
			if (
				data._id.toString() == friendData.recipient &&
				friendData.status === 3
			) {
				return (newData = {
					_id: data._id,
					lastName: data.lastName,
					firstName: data.firstName,
					photo: data.photo,
					status: friendData.status,
				});
			}
		});
		return newData;
	});

	allFriendsList = allFriendsList.filter(function (element) {
		return element !== undefined;
	});

	res.status(200).json(allFriendsList);
});

// @desc    Get friends suggestions
// @route   GET /api/friends/suggestions
// @access  Private
const getFriendSuggestions = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}
	const userData = await User.findById(req.user._id);
	const userFriendsData = await Friend.find({ _id: { $in: userData.friends } });

	// Get all the user except the logged in user
	var friendSuggestions = await User.find({ _id: { $ne: req.user._id } });

	var friendSuggestionList = friendSuggestions.map((data) => ({
		_id: data._id,
		lastName: data.lastName,
		firstName: data.firstName,
		photo: data.photo,
		status: 0,
	}));

	var suggestionList = friendSuggestionList.map((data) => {
		if (userFriendsData.some((e) => e.recipient == data._id.toString())) {
			var newData;
			userFriendsData.map((friendData) => {
				if (
					data._id.toString() == friendData.recipient &&
					friendData.status === 1
				) {
					return (newData = {
						_id: data._id,
						lastName: data.lastName,
						firstName: data.firstName,
						photo: data.photo,
						status: friendData.status,
					});
				}
			});
			return newData;
		} else {
			return data;
		}
	});

	suggestionList = suggestionList.filter(function (element) {
		return element !== undefined;
	});

	res.status(200).json(suggestionList);
});

// @desc    Get friends data by _id
// @route   GET /api/friends/friend/:id
// @access  Private
const getFriendsDataById = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}
	const friendData = await Friend.findById(req.params.id);

	res.status(200).json(friendData);
});

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const docA = await Friend.findOneAndUpdate(
		{ requester: req.body.UserA, recipient: req.body.UserB },
		{ $set: { status: 1 } },
		{ upsert: true, new: true }
	);
	const docB = await Friend.findOneAndUpdate(
		{ recipient: req.body.UserA, requester: req.body.UserB },
		{ $set: { status: 2 } },
		{ upsert: true, new: true }
	);

	const dataUserA = await User.find({
		_id: req.body.UserA,
		friends: docA._id,
	});

	const dataUserB = await User.find({
		_id: req.body.UserB,
		friends: docA._id,
	});

	if (dataUserA.length === 0 && dataUserB.length === 0) {
		await User.findOneAndUpdate(
			{ _id: req.body.UserA },
			{ $push: { friends: docA._id } }
		);
		await User.findOneAndUpdate(
			{ _id: req.body.UserB },
			{ $push: { friends: docB._id } }
		);
		res.status(200).json('Friend Request sent');
	} else {
		res.status(200).json('Friend request already sent');
	}
});

// @desc    Accept friend request
// @route   PUT /api/friends/accept
// @access  Private
const acceptFriendRequest = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	await Friend.findOneAndUpdate(
		{ requester: req.body.UserA, recipient: req.body.UserB },
		{ $set: { status: 3 } }
	);

	await Friend.findOneAndUpdate(
		{ recipient: req.body.UserA, requester: req.body.UserB },
		{ $set: { status: 3 } }
	);

	res.status(200).json('Friend accepted');
});

// @desc    Reject friend request
// @route   PUT /api/friends/reject
// @access  Private
const rejectFriendRequest = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const dataUserA = await Friend.find({
		requester: req.body.UserA,
		recipient: req.body.UserB,
	});

	const dataUserB = await Friend.find({
		recipient: req.body.UserA,
		requester: req.body.UserB,
	});

	if (
		dataUserA.length > 0 &&
		dataUserB.length > 0 &&
		dataUserA[0].status !== 3 &&
		dataUserB[0].status !== 3
	) {
		const docA = await Friend.findOneAndRemove({
			requester: req.body.UserA,
			recipient: req.body.UserB,
		});
		const docB = await Friend.findOneAndRemove({
			recipient: req.body.UserA,
			requester: req.body.UserB,
		});
		await User.findOneAndUpdate(
			{ _id: req.body.UserA },
			{ $pull: { friends: docA._id } }
		);
		await User.findOneAndUpdate(
			{ _id: req.body.UserB },
			{ $pull: { friends: docB._id } }
		);
		res.status(200).json('Friend request rejected');
	} else if (dataUserA[0].status === 3 && dataUserB[0].status === 3) {
		res.status(200).json('Friend already accepted');
	} else {
		res.status(200).json('Friend request already rejected');
	}
});

// @desc    Unfriend request
// @route   PUT /api/friends/unfriend
// @access  Private
const unFriendRequest = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const dataUserA = await Friend.find({
		requester: req.body.UserA,
		recipient: req.body.UserB,
	});

	const dataUserB = await Friend.find({
		recipient: req.body.UserA,
		requester: req.body.UserB,
	});

	if (
		dataUserA.length > 0 &&
		dataUserB.length > 0 &&
		dataUserA[0].status === 3 &&
		dataUserB[0].status === 3
	) {
		const docA = await Friend.findOneAndRemove({
			requester: req.body.UserA,
			recipient: req.body.UserB,
		});
		const docB = await Friend.findOneAndRemove({
			recipient: req.body.UserA,
			requester: req.body.UserB,
		});
		await User.findOneAndUpdate(
			{ _id: req.body.UserA },
			{ $pull: { friends: docA._id } }
		);
		await User.findOneAndUpdate(
			{ _id: req.body.UserB },
			{ $pull: { friends: docB._id } }
		);
		res.status(200).json('Unfriended');
	} else if (dataUserA[0].status !== 3 && dataUserB[0].status !== 3) {
		res.status(200).json('Friend request still pending');
	} else {
		res.status(200).json('Already unfriended');
	}
});

module.exports = {
	getUserFriends,
	getAllUserFriends,
	getFriendSuggestions,
	getFriendsDataById,
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	unFriendRequest,
};
