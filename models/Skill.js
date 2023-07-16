const mongoose = require('mongoose');
const { Schema } = mongoose;

const skillSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    difficulty: { type: Schema.Types.ObjectId, ref: 'Difficulty', required: true },
    category: { type: String, required: true },
    attributes: [{
        id: {type: Schema.Types.ObjectId, ref: 'Attribute', required: true},
        affected: { type: Number, required: true }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true },
    attributeExplanation: { type: String, required: true, trim: true },
    difficultyExplanation: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
    deregistrationDate: { type: Date },
    deregistrationReason: { type: String, trim: true },
    approvedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    approvedDate: { type: Date },
    active: {type: Boolean, default: false, required: true},
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;