const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
	{
		lastName: {
			type: String,
			required: [true, 'Please add a last name'],
		},
		firstName: {
			type: String,
			required: [true, 'Please add a first name'],
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: true,
		},
		photo: {
			type: String,
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
		},
		settings: {
			isDarkMode: { type: Boolean },
		},
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friends' }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
