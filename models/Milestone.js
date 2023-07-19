const mongoose = require('mongoose');
const { Schema } = mongoose;

const milestoneSchema = new Schema({
    level: {type: Number, required: true},
    requirement: {type: String, required: true},
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;