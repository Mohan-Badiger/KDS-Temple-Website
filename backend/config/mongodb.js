import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("DB Connected successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn("MongoDB disconnected");
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/temple`);
    } catch (err) {
        console.error("Failed to connect to MongoDB on startup:", err);
        process.exit(1);
    }
}

export default connectDB;
