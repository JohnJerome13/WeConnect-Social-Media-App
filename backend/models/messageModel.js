const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		message: {
			type: String,
			required: [true, 'Please enter a message'],
		},
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Message', messageSchema);
