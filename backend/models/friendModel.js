const mongoose = require('mongoose');
const friendSchema = mongoose.Schema(
	{
		requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		status: {
			type: Number,
			enums: [
				1, //'requested',
				2, //'pending',
				3, //'friends'
			],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Friend', friendSchema);
