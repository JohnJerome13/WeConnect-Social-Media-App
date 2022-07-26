const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { lastName, firstName, email, password } = req.body;

	if (!lastName || !firstName || !email || !password) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	//Check if user exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	//Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//Create user
	const user = await User.create({
		lastName,
		firstName,
		email,
		password: hashedPassword,
		settings: {
			isDarkMode: true,
		},
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			lastName: user.lastName,
			firstName: user.firstName,
			email: user.email,
			settings: {
				isDarkMode: user.settings.isDarkMode,
			},
			token: generateToken(user.id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc    Update user data
// @route   PUT /api/users/account
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const user = await User.findById(req.user._id);

	const { lastName, firstName, password } = req.body;

	if (!lastName || !firstName) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	//Hash password
	var hashedPassword;
	if (password) {
		const salt = await bcrypt.genSalt(10);
		hashedPassword = await bcrypt.hash(password, salt);
	}

	var fileName;
	if (req.file) {
		// Insert new file
		const formatedName = req.file.originalname.split(' ').join('-');
		fileName = `${uuidv4()}-${Date.now()}-${formatedName}`;
		await sharp(req.file.buffer)
			.resize({ width: 1080 })
			.toFile(`frontend/public/uploads/${fileName}`);
	} else {
		fileName = req.body.photo;
	}

	// Delete old file if replaced or removed
	if (user.photo && user.photo !== req.body.photo) {
		fs.unlink(`frontend/public/uploads/${user.photo}`, function (err) {
			if (err) {
				throw err;
			} else {
				console.log('Successfully deleted the old file.');
			}
		});
	}

	const updatedUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			lastName,
			firstName,
			photo: fileName ? fileName : null,
			password: password ? hashedPassword : user.password,
		},
		{
			new: true,
		}
	);

	res.status(200).json(updatedUser);
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user email
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			lastName: user.lastName,
			firstName: user.firstName,
			email: user.email,
			photo: user.photo,
			settings: user.settings,
			token: generateToken(user.id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
	}
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getUserDataById = asyncHandler(async (req, res) => {
	// Check for user auth
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const user = await User.findById(req.params.id);

	// Check for user
	if (!user) {
		res.status(401);
		throw new Error('User not found');
	}

	res.status(200).json(user);
});

// Generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

// @desc    Update user settings
// @route   GET /api/users/settings
// @access  Private
const userSettings = asyncHandler(async (req, res) => {
	const { isDarkMode } = req.body;

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	const updatedUserSettings = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				settings: { isDarkMode: isDarkMode },
			},
		},
		{
			new: true,
		}
	);
	res.status(200).json(updatedUserSettings);
});

module.exports = {
	registerUser,
	updateUser,
	loginUser,
	getMe,
	getUserDataById,
	userSettings,
};
