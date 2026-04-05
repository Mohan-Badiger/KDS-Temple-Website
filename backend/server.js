import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import contactMail from './services/contactMail.js';
import poojaRouter from './routes/poojaRoute.js';
import cloudinary from './config/cloudinary.js';
import bookingRouter from './routes/bookingRoute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import donationRoutes from './routes/donationRoute.js';
import templeRouter from './routes/templeRoute.js';
import annaprasadRouter from './routes/annaprasadRoute.js';

//App config
const app = express();
const port = process.env.PORT || 4000
connectDB()
cloudinary

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/pooja', poojaRouter);
app.use("/api/bookings", bookingRouter);
app.use('/api/donations', donationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/temple', templeRouter);
app.use('/api/annaprasads', annaprasadRouter);

app.post('/api/contact', contactMail)

app.get('/', (req, res) => {
    res.send("API Working");
})

// Global 404 fallback
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

app.listen(port, () => console.log('Server started on PORT : ' + port))