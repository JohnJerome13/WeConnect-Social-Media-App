import axios from 'axios'

const API_URL = 'https://weconnect-mern-app.herokuapp.com/api/users/';

const config = (token) => {
 return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
} 

// Get messages
const getMessages = async (paramsId, token) => {
  
  const response = await axios.get(API_URL + paramsId, config(token))
 
  return response.data
}

// Send a message
const sendMessage = async (messageData, token) => {

  const response = await axios.post(API_URL + messageData.recipientId, messageData, config(token))
 
  return response.data
}

const messageService = {
  sendMessage,
  getMessages,
}

export default messageService