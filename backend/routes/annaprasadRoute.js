import express from 'express';
import { donateAnnaprasad, getAllAnnaprasads } from '../controllers/annaprasadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to donate (can be auth-protected if needed)
router.post('/donate', donateAnnaprasad);

// Admin route to get all annaprasad records
router.get('/annaprasads', getAllAnnaprasads);

export default router;
