import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { donateController, getAllDonations } from '../controllers/donationController.js';

const router = express.Router();

router.post('/donate', authMiddleware, donateController);

router.get('/donations', getAllDonations);

export default router;
