import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/AI_NOTES_WORKSPACE";
        const conn = await mongoose.connect(mongoUri);
        console.log("mongo db connected: ", conn.connection.host);
    } catch (error) {
        console.log("error in mongodb connection",error.message);
        process.exit(1)
    }
}

export default connectDB;