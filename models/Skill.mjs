import mongoose from 'mongoose';
const { Schema } = mongoose;

const skillSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: {type: Number, required: true, default: 0.50}
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;