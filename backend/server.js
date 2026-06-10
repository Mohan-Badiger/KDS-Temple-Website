import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import contactMail from './services/contactMail.js';
import poojaRouter from './routes/poojaRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import donationRoutes from './routes/donationRoute.js';
import templeRouter from './routes/templeRoute.js';
import annaprasadRouter from './routes/annaprasadRoute.js';
import reportRouter from './routes/reportRoute.js';
import adminRouter from './routes/adminRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
import settingsRouter from './routes/settingsRoute.js';

// Environment variables validation
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'ADMIN_EMAIL'
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Error: Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

//App config
const app = express();
const port = process.env.PORT || 4000
connectDB()

// Rate limiter for contact route
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact requests per windowMs
  message: { success: false, message: "Too many contact requests from this IP. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

//middlewares
app.use(helmet());
app.use(express.json({ limit: '10kb' }))

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/pooja', poojaRouter);
app.use("/api/bookings", bookingRouter);
app.use('/api/donations', donationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/temple', templeRouter);
app.use('/api/annaprasads', annaprasadRouter);
app.use('/api/reports', reportRouter);
app.use('/api/settings', settingsRouter);

app.post('/api/contact', contactLimiter, contactMail)

app.get('/', (req, res) => {
    res.send("API Working");
})

// Global 404 fallback
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

app.listen(port, () => console.log('Server started on PORT : ' + port))