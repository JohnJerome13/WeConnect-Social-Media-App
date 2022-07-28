const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');

// @desc    Get posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
	await Post.find({ user: req.user.id });
	Post.aggregate([
		{
			$lookup: {
				from: 'users', // collection name in db
				localField: 'user',
				foreignField: '_id',
				as: 'userData',
			},
		},
	]).exec(function (err, postData) {
		var userPostData = postData.map((data) => {
			return data.userData.map((obj) => ({
				...data,
				userData: {
					_id: obj._id,
					email: obj.email,
					firstName: obj.firstName,
					lastName: obj.lastName,
					photo: obj.photo,
				},
			}));
		});
		res.status(200).json(userPostData.map((data) => data[0]));
	});
});

// @desc    Set post
// @route   POST /api/posts
// @access  Private
const setPost = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400);
		throw new Error('Please add a text field');
	}

	if (req.file) {
		const formatedName = req.file.originalname.split(' ').join('-');
		var fileName = `${uuidv4()}-${Date.now()}-${formatedName}`;

		await sharp(req.file.buffer)
			.resize({ width: 720 })
			.toFile(`frontend/public/uploads/${fileName}`);
	}

	var post = await Post.create({
		user: req.user.id,
		text: req.body.text,
		photo: fileName ? fileName : null,
		audience: req.body.audience,
	});

	const user = await User.findById(post.user);

	post = {
		...post._doc,
		userData: {
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			photo: user.photo,
		},
	};

	res.status(200).json(post);
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}

	// Make sure the logged in user matches the post user
	if (post.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User not authorized');
	}

	if (req.file) {
		// Insert new file
		const formatedName = req.file.originalname.split(' ').join('-');
		var fileName = `${uuidv4()}-${Date.now()}-${formatedName}`;
		await sharp(req.file.buffer)
			.resize({ width: 720 })
			.toFile(`frontend/public/uploads/${fileName}`);
	} else {
		var fileName = req.body.photo;
	}

	// Delete old file if replaced or removed
	if (post.photo && post.photo !== req.body.photo) {
		fs.unlink(`frontend/public/uploads/${post.photo}`, function (err) {
			if (err) {
				throw err;
			} else {
				console.log('Successfully deleted the old file.');
			}
		});
	}

	const updatedPost = await Post.findByIdAndUpdate(
		req.params.id,
		{
			text: req.body.text,
			audience: req.body.audience,
			photo: fileName ? fileName : null,
		},
		{
			new: true,
		}
	);

	res.status(200).json(updatedPost);
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const post = await Post.findById(req.params.id);

	await Comment.deleteMany({ postId: req.params.id });

	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}

	// Make sure the logged in user matches the post user
	if (post.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User not authorized');
	}

	if (post.photo) {
		fs.unlink(`frontend/public/uploads/${post.photo}`, function (err) {
			if (err) {
				throw err;
			} else {
				console.log('Successfully deleted the file.');
			}
		});
	}

	await post.remove();

	res.status(200).json({ id: req.params.id });
});

// @desc    Like post
// @route   PUT /api/posts/:id/likes
// @access  Private
const likePost = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}

	const postLikes = await Post.find({
		'likes.userId': req.body.userId,
		_id: req.body.postId,
	});

	var likeResponse;

	if (postLikes.length > 0) {
		likeResponse = await Post.findByIdAndUpdate(
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
		likeResponse = await Post.findByIdAndUpdate(
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

// @desc    Save post
// @route   PUT /api/posts/:id/saves
// @access  Private
const savePost = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}

	const postSaves = await Post.find({
		'saves.userId': req.body.userId,
		_id: req.body.postId,
	});

	var saveResponse;

	if (postSaves.length > 0) {
		saveResponse = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$pull: {
					'saves.userId': req.body.userId,
				},
			},
			{
				new: true,
			}
		);
	} else {
		saveResponse = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					'saves.userId': req.body.userId,
				},
			},
			{
				new: true,
			}
		);
	}

	res.status(200).json(saveResponse);
});

module.exports = {
	getPosts,
	setPost,
	updatePost,
	deletePost,
	likePost,
	savePost,
};
