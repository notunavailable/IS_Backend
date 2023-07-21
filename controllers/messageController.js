const User = require('../models/User.js')
const {getSystemMessage} = require('../utils/chatgpt.js')
const Message = require('../models/Message.js')

const addMessage = async ({userId, messageReason}) => {
  const user = await User.findById(userId); 
  if(!user){
    console.error("No user found")
    return;
  }
  const message = await getSystemMessage({messageReason: messageReason})
  const newMessage = await Message.create(message)
  user.systemLogs.push(newMessage._id);
}

module.exports = {addMessage}