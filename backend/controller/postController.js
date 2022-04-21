const asyncHandler = require('express-async-handler')
const { find, findByIdAndUpdate } = require('../models/postModel')

const Post = require('../models/postModel')
const User = require('../models/userModel')

// @desc    Get post
// @route   Get /api/posts
// @access  Private
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.find({ user: req.user.id })
    res.status(200).json(post)
})
 
// @desc    Set post
// @route   POST /api/post
// @access  Private
const setPost = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please send text')
    }

    const post = await Post.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(post)
})

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id)

    if(!post) {
        res.status(400)
        throw new Error('Post not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the post user
    if(post.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedPost)
})

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id)

    if(!post) {
        res.status(400)
        throw new Error('Post not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the post user
    if(post.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await post.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getPost,
    setPost,
    updatePost,
    deletePost
}

