const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

//modelse
const UnregisteredQueue = require('../models/UnregisteredQueue.js')

const push = async ({ refModel, addition }) => {
    //check to see if queue exists
    const existingQueue = await UnregisteredQueue.findOne({ refModel: refModel })
    if (!existingQueue) {
        return;
    }

    existingQueue.items.push(addition);
    await existingQueue.save();
    return(existingQueue.items)
}

const pull = async ({refModel, id}) => {
    const existingQueue = await UnregisteredQueue.findOne({refModel: refModel});

    if(!existingQueue) {
        throw new Error(`Queue with path ${refModel} not found`);
    }
    
    if(!existingQueue.queue.includes(id)) {
        throw new Error(`ID ${id} not found in the Queue`);
    }

    // Remove the element from the queue
    existingQueue.queue.pull(id);

    // Save the updated document
    await existingQueue.save();

    return { success: true, message: `ID ${id} successfully removed from ${refModel} queue` };
}

module.exports = { push, pull }