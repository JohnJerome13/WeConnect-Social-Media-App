const mongoose = require('mongoose')
const { object } = require('sharp/lib/is')
const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: [true, 'Please add a text'],
        },
        photo: {
            type: String,
        },
        audience: {
            type: String,
            required: [true, 'Please add audience'],
        },
        likes: {
            userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Post', postSchema)