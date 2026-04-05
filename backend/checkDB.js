import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import TempleModel from './models/templeModel.js';

(async () => {
    try {
        await connectDB();
        const temples = await TempleModel.find();
        console.log('TEMPLES_COUNT:', temples.length);
        console.log('TEMPLES_LIST:', JSON.stringify(temples, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
