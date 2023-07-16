const mongoose = require('mongoose');
const { Schema } = mongoose;

const questSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    skills: [{
        id: {type: Schema.Types.ObjectId, ref: "Skill", required: true},
        affected: {type: Number, required: true}
    }],
    difficulty: {type: Schema.Types.ObjectId, ref: "Difficulty", required: true},
    timed: {type: Boolean, required: true, default: false},
    time: {type: Number},
});

const Quest = mongoose.model('Quest', questSchema);
module.exports = Quest;