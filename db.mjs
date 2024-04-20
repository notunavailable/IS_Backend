import mongoose from 'mongoose';

const connectDB = () => {
    if(process.env.isDev === "true"){
        mongoose.connect(process.env.DSN_DEV);
    } else {
        mongoose.connect(process.env.DSN_PROD);
    }
    console.log("MongoDB successfully connected.");
}

export default connectDB;