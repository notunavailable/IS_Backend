const mongoose = require('mongoose');
const { Schema } = mongoose;

const unregisteredQueue = new Schema({
    refModel: { type: String, required: true, trim: true, unique: true },
    items: [{
      type: Schema.Types.ObjectId,
      refPath: 'refModel'
    }]
  });

const UnregisteredQueue = mongoose.model('UnregisteredQueue', unregisteredQueue);
module.exports = UnregisteredQueue;