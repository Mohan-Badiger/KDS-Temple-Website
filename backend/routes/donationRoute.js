import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';
import { donateController, getAllDonations, getMyDonations } from '../controllers/donationController.js';

const router = express.Router();

router.post('/donate', authMiddleware, donateController);

router.get('/donations', adminAuth, getAllDonations);

router.get('/my-donations', authMiddleware, getMyDonations);

export default router;
