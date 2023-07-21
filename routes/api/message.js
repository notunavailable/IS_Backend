const express = require("express");
const { populateDifficulties } = require("../../utils/xp.js")
const router = express.Router();

const Message = require('../../models/Message.js')
const User = require('../../models/User.js')

const {getSystemMessage} = require('../../utils/chatgpt.js')


router.post("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ error: "No id found" })
        }

        const user = User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }

        const messageReason = req.body.messageReason;
        if(!messageReason){
            return res.status(404).json({error: "No message reason found"})
        }
        const message = await getSystemMessage({messageReason: messageReason})
        const newMessage = await Message.create(message);
        user.systemLogs.push(newMessage._id);
        user.save();
        return res.status(200).json(message)

    } catch (error) {
        return res.status(500).json({ error: `An error occured while creating message. ${error}` })
    }
})

//Still haven't deleted it from user systemLogs
router.delete("/:id", async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            return res.status(404).json({error: "No id found"})
        }
        Message.findByIdAndDelete(id);
    } catch (error) {
        return res.status(500).json({error: `An error occured while deleting message. ${error}`})
    }
})


// Change the seen property of a message
router.put("/seen/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ error: "No id found" })
        }

        const message = Message.findById(id);

        if (!message) {
            return res.status(404).json({ error: "No message found" });
        }

        message.seen = true;
        await message.save();
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ error: `An error occurred while changing seen property of message. ${error}` });
    }
});