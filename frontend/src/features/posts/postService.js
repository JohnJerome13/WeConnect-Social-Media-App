import axios from 'axios'

const API_URL = 'http://localhost:5000/api/posts/'

// Create new post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, postData, config)
  return response.data
}

// Get user posts
const getPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Update post
const updatePost = async (postId, postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + postId, postData, config)
  return response.data
}

// Delete user post
const deletePost = async (postId, postPhoto, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      fileName: postPhoto
    }
  }
  
  const response = await axios.delete(API_URL + postId, config)

  return response.data
}

const postService = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
}

export default postService
