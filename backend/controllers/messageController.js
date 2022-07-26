const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');

// @desc    Get messages
// @route   GET /api/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const conversation = await Conversation.findOne({
		$or: [
			{
				'participants.userA': req.user._id,
				'participants.userB': req.params.id,
			},
			{
				'participants.userA': req.params.id,
				'participants.userB': req.user._id,
			},
		],
	}).catch(() => {
		res.status(404);
		throw new Error('Conversation not found!');
	});

	var message = await Message.find({
		conversationId: conversation._id,
	});

	res.status(200).json(message);
});

// @desc    Create message
// @route   POST /api/messages
// @access  Private
const createMessage = asyncHandler(async (req, res) => {
	if (!req.body.message) {
		res.status(400);
		throw new Error('Please enter a message');
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	var conversation;

	const isConversation = await Conversation.findOne({
		$or: [
			{
				'participants.userA': req.user._id,
				'participants.userB': req.params.id,
			},
			{
				'participants.userA': req.params.id,
				'participants.userB': req.user._id,
			},
		],
	});

	isConversation
		? (conversation = isConversation)
		: (conversation = await Conversation.create({
				participants: {
					userA: req.user._id,
					userB: req.params.id,
				},
		  }));

	var message = await Message.create({
		sender: req.user._id,
		message: req.body.message,
		conversationId: conversation._id,
	});

	res.status(200).json(message);
});

module.exports = {
	createMessage,
	getMessages,
};
