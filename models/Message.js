const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    title: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    createdAt: { type: Date, default: Date.now, required: true },
    seen: { type: Boolean, default: false, required: true}
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;