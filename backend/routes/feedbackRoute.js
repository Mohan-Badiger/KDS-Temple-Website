import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';
import rateLimit from 'express-rate-limit';

const feedbackRouter = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 submissions per windowMs
  message: { success: false, message: 'Too many feedback submissions from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

feedbackRouter.post('/submit', feedbackLimiter, submitFeedback);

export default feedbackRouter;
