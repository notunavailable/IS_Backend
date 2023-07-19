const mongoose = require('mongoose');
const { Schema } = mongoose;

const guildSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    admin: [{type: Schema.Types.ObjectId, ref: 'User'}],
    description: {type: String, required: true, trim: true},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now, required: true},
    updatedAt: { type: Date, default: Date.now, required: true },
    deregistrationDate: { type: Date },
    deregistrationReason: { type: String, trim: true },
    url: { type: String }
});

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;