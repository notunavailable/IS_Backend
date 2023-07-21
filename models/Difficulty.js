const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the difficulty model
const difficultySchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  level0: { type: String, required: true},
  multiplier: {type: Number, unique: true, required: true},
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  color: {type: String, required: true},
  levelXP: {type: Number, required: true}
});

const Difficulty = mongoose.model('Difficulty', difficultySchema);
module.exports = Difficulty;