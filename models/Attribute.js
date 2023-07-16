const mongoose = require('mongoose');
const { Schema } = mongoose;

const attributeSchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true }, 
  type: { type: String, required: true, trim: true }, 
  difficulty: { type: Schema.Types.ObjectId, ref: 'Difficulty', required: true},
  description: { type: String, required: true, trim: true }, 
  difficultyExplanation: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deregistered: { type: Boolean, default: false },
  deregistrationDate: { type: Date },
  deregistrationReason: { type: String, trim: true },
});

const Attribute = mongoose.model('Attribute', attributeSchema);
module.exports = Attribute;