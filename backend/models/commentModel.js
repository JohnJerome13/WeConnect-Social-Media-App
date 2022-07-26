const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Post',
		},
		comment: {
			type: String,
			required: [true, 'Please add a text'],
		},
		likes: {
			userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Comment', commentSchema);
