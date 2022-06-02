const express = require('express')
const router = express.Router()

const {
  getComments,
  setComment,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getComments).post(protect, setComment)
router.route('/:id').delete(protect, deleteComment).put(protect, updateComment)
router.route('/:id/likes').put(protect, likeComment)


module.exports = router
