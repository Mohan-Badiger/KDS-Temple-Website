import mongoose from "mongoose";
import 'dotenv/config';
import TempleModel from "./models/templeModel.js";
import connectDB from "./config/mongodb.js";

const seedTemples = async () => {
    try {
        console.log("Starting seeding process...");
        console.log("URI from env:", process.env.MONGODB_URI ? "Found" : "NOT FOUND");
        await connectDB();
        console.log("Connection established successfully.");
        
        const temples = [
            { name: "Kadasiddeshwar Temple", location: "Main Chowk, Banahatti" },
            { name: "Shivalaya Temple", location: "Near River Side, Banahatti" },
            { name: "Ganesha Mandir", location: "Market Area, Banahatti" },
            { name: "Hanuman Temple", location: "Hill Top, Banahatti" }
        ];

        for (const temple of temples) {
            const exists = await TempleModel.findOne({ name: temple.name });
            if (!exists) {
                await TempleModel.create(temple);
                console.log(`Added temple: ${temple.name}`);
            } else {
                console.log(`Temple already exists: ${temple.name}`);
            }
        }

        console.log("Seeding completed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedTemples();
