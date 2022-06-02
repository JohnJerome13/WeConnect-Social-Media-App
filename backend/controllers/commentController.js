const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');

// @desc    Get comments
// @route   GET /api/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
	const comments = await Comment.find({ user: req.user.id });

	res.status(200).json(comments);
});

// @desc    Set comment
// @route   POST /api/comments
// @access  Private
const setComment = asyncHandler(async (req, res) => {
	if (!req.body.comment) {
		res.status(400);
		throw new Error('Please add a comment');
	}

	const comment = await Comment.create({
		user: req.user.id,
		postId: req.body.postId,
		comment: req.body.comment,
	});

	res.status(200).json(comment);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		res.status(400);
		throw new Error('Comment not found');
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	// Make sure the logged in user matches the comment user
	if (comment.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User not authorized');
	}

	const updatedComment = await Comment.findByIdAndUpdate(
		req.params.id,
		{
			comment: req.body.comment,
		},
		{
			new: true,
		}
	);

	res.status(200).json(updatedComment);
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		res.status(400);
		throw new Error('Comment not found');
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	// Make sure the logged in user matches the comment user
	if (comment.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User not authorized');
	}

	await comment.remove();

	res.status(200).json({ id: req.params.id });
});

// @desc    Like comment
// @route   PUT /api/comments/:id
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		res.status(400);
		throw new Error('Comment not found');
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const commentLikes = await Comment.find({
		'likes.userId': req.body.userId,
		_id: req.body.commentId,
	});

	var likeResponse;

	if (commentLikes.length > 0) {
		likeResponse = await Comment.findByIdAndUpdate(
			req.params.id,
			{
				$pull: {
					'likes.userId': req.body.userId,
				},
			},
			{
				new: true,
			}
		);
	} else {
		likeResponse = await Comment.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					'likes.userId': req.body.userId,
				},
			},
			{
				new: true,
			}
		);
	}

	res.status(200).json(likeResponse);
});

module.exports = {
	getComments,
	setComment,
	updateComment,
	deleteComment,
	likeComment,
};
