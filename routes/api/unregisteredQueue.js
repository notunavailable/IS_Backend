const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

//modelse
const UnregisteredQueue = require('../../models/UnregisteredQueue.js')
const User = require('../../models/User.js');
const Skill = require('../../models/Skill.js')
const Attribute = require('../../models/Attribute.js')
const Difficulty = require('../../models/Difficulty.js')
const Category = require("../../models/Category.js");
const Ability = require("../../models/Ability.js");

//controllers
const { push } = require('../../controllers/unregisteredQueueController.js')

//Register User
router.post('/register', async (req, res) => {
    const {
        name,
    } = req.body;

    try {
        // Check if a queue with the same name already exists
        const existingQueue = await UnregisteredQueue.findOne({ name: name });

        if (existingQueue) {
            return res.status(400).send({ error: 'Queue already registered' });
        }

        // Create a new queue
        const queue = UnregisteredQueue.create({
            name
        });

        return res.status(201).send(queue);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Server error occurred' });
    }
});


router.put('/add/:name', async (req, res) => {
    const name = req.params.name;
    const addition = req.body.addition;
    const ref = req.body.ref;
    try {
        if (push({ name: name, addition: addition, refModel: ref })) {
            // Send a response 
            return res.status(200).send({ message: 'Item added to the queue' });
        } else {
            return res.status(500).send({error: `Could not push addition to unregistered queue: ${name}`})
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Server error occured' })
    }

})

router.get('/get/:refModel', async (req, res) => {
    const refModel = req.params.refModel;
    try {
        const queue = await UnregisteredQueue.findOne({ refModel: refModel })
        .populate({
             path: 'items',
             populate: {
                 path: 'difficulty'
             }
        })
        .exec();

        if(queue)
            res.status(200).json({ message: "Success", queue });
        else 
            res.status(404).json({ message: "Queue not found." });  
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred." });
    }
});

module.exports = router;