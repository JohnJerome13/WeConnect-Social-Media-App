const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp')
const fs = require("fs")


// @desc    Get posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user.id })

  res.status(200).json(posts)
})

// @desc    Set post
// @route   POST /api/posts
// @access  Private
const setPost = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  if (req.file) {
    const formatedName = req.file.originalname.split(' ').join('-');
    var fileName = `${uuidv4()}-${Date.now()}-${formatedName}`;

    await sharp(req.file.buffer)
    .resize({ width: 1080 })
    .toFile(`frontend/public/uploads/${fileName}`);
  }
  
  const post = await Post.create({
    user: req.user.id,
    text: req.body.text,
    photo: fileName ? fileName : null,
  })

  res.status(200).json(post)
})

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(400)
    throw new Error('Post not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  
  if (req.file) {
    // Insert new file
    const formatedName = req.file.originalname.split(' ').join('-');
    var fileName = `${uuidv4()}-${Date.now()}-${formatedName}`;
    await sharp(req.file.buffer)
    .resize({ width: 1080 })
    .toFile(`frontend/public/uploads/${fileName}`);
  } else {
    var fileName = req.body.photo
  }
  
  // Delete old file if replaced or removed
  if (post.photo && post.photo !== req.body.photo) {
    fs.unlink(`frontend/public/uploads/${post.photo}`, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the old file.")
      }
    });
  }
  
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
    text: req.body.text,
    photo: fileName ? fileName : null,
  }, {
    new: true,
  })

  res.status(200).json(updatedPost)
})

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(400)
    throw new Error('Post not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  
  if (post.photo) {
    fs.unlink(`frontend/public/uploads/${post.photo}`, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the file.")
      }
    });
  }

  await post.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getPosts,
  setPost,
  updatePost,
  deletePost,
}
