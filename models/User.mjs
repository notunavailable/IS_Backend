import mongoose from 'mongoose';
const {Schema} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    experience: {type: Number, required: true, default: 0},
    level: {type: Number, required: true, default: 0},
    birthday: {type: Date, required: true},
    skills: [
        {
            skillRef: {type: Schema.ObjectId, required: true, ref: 'Skill'},
            tracking: {type: Boolean, default: false},
            level: {type: Number, required: true, default: 0},
            experience: {type: Number, required: true, default: 0},
            log: [
                {
                    start: {type: Date, required: true},
                    end: {type: Date}
                }
            ]
        }
    ]
});

const User = mongoose.model('User', UserSchema);
export default User;