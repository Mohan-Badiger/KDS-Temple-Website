import express from 'express';
import { donateAnnaprasad, getAllAnnaprasads } from '../controllers/annaprasadController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Protected route to donate
router.post('/donate', authMiddleware, donateAnnaprasad);

// Admin route to get all annaprasad records
router.get('/annaprasads', adminAuth, getAllAnnaprasads);

export default router;
