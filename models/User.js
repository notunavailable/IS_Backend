const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true, trim: true }, 
  email: { type: String, unique: true, required: true, lowercase: true, trim: true }, 
  password: { type: String, required: true },
  birthday: {type: Date, required: true},
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  level: {type: Number, required: true, default: 0},
  experience: {type: Number, required: true, default: 0},
  systemLogs: [{
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    createdAt: { type: Date, default: Date.now, required: true },
  }],
  skillSlots: {type: Number, required: true, default: 5},
  difficulty: { type: Schema.Types.ObjectId, ref: 'Difficulty', required: true },
  race: { type: String, default: "Human" },
  skills: [{
    id: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    level: { type: Number, default: 0, required: true },
    experience: { type: Number, default: 0, required: true },
    lastPracticed: { type: Date },
    practicing: {type: Boolean, default: false, required: true},
    practicingLogs: [{
        start: { type: Date, default: null },
        end: { type: Date, default: null },
        practiceDescription: { type: String, required: false, trim: true },
        expGained: {type: Number, required: true}
    }],
    addedAt: {type: Date, required: true, default: Date.now},
    deregistered: { type: Boolean, default: false, required: true },
    deregistrationDate: { type: Date },
    deregistrationReason: { type: String, trim: true },
  }],
  attributes: [{
    id: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
    level: { type: Number, default: 0, required: true },
    experience: { type: Number, default: 0, required: true },
    lastXPGain: {type: Date},
    addedAt: {type: Date, required: true},
    deregistered: { type: Boolean, default: false },
    deregistrationDate: { type: Date },
    deregistrationReason: { type: String, trim: true },
  }],
  registrationDate: { type: Date, default: Date.now, required: true },
  lastLoginDate: { type: Date, default: Date.now, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;