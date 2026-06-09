import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongodbUri = process.env.MONGODB_URI ;
        const conn = await mongoose.connect(mongodbUri);
        console.log("mongo db connected: ", conn.connection.host);
    } catch (error) {
        console.log("error in mongodb connection",error.message);
        process.exit(1)
    }
}

export default connectDB;