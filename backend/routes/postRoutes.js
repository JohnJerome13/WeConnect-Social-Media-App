const express = require('express')
const router = express.Router()
const { 
    getPost, 
    setPost, 
    updatePost, 
    deletePost 
} = require('../controller/postController')

const {protect} = require('../middleware/authMiddleware')
    
router.route('/').get(protect, getPost).post(protect, setPost)
router.route('/:id').put(protect, updatePost).delete(protect, deletePost)

module.exports = router