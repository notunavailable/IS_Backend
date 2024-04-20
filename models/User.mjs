import mongoose from 'mongoose';
const {Schema} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    skills: [
        {
            skillRef: {type: Schema.ObjectId, required: true},
            tracking: {type: Boolean, default: false},
            log: [
                {
                    start: {type: Date, required: true},
                    end: {type: Date, required: true}
                }
            ]
        }
    ]
});

const User = mongoose.model('User', UserSchema);
export default User;