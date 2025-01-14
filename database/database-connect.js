import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Atlas connection successful...`);
    } catch (error) {
        console.error(`MongoDB Atlas connection failed!!!`);
        process.exit(1);
    }
}

export default connectToDb;