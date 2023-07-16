const mongoose = require('mongoose');
const { Schema } = mongoose;

const habitSchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  frequency: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{
      skill: {type: Schema.Types.ObjectId, ref: 'Skill', required: true},
      xp: {type: Number, min: 0, required: true}
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;