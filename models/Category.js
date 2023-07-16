const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deregistered: { type: Boolean, default: false },
  deregistrationDate: { type: Date },
  deregistrationReason: { type: String, trim: true },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;