import mongoose from 'mongoose';
const { Schema } = mongoose;

const skillSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tracking: {type: Boolean, default: false}
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;