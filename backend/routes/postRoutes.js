const express = require('express')
const router = express.Router()

const {
  getPosts,
  setPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController')

const { protect } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

router.route('/').get(protect, getPosts).post(protect, upload.single('photo'), setPost)
router.route('/:id').delete(protect, deletePost).put(protect, upload.single('photo'), updatePost)
router.route('/:id/likes').put(protect, likePost)

module.exports = router
