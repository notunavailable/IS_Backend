const {getSystemMessage} = require('../utils/chatgpt')

const messageTest = async () => {
    const message = getSystemMessage({messageReason: "The user has gained 30 experience in the skill Basic Vehicle Climbing."})
    return message;
}

module.exports = {messageTest}