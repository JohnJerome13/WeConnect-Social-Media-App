const mongoose = require('mongoose');
const conversationSchema = mongoose.Schema(
	{
		participants: {
			userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Conversation', conversationSchema);
