import express from 'express';
import { donateAnnaprasad, getAnnaprasadDonations } from '../controllers/annaprasadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/donate', authMiddleware, donateAnnaprasad); 
router.get('/annaprasads', getAnnaprasadDonations); 

export default router;
