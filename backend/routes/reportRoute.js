import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { 
    getDashboardSummary, 
    getAnalyticsDetails, 
    getTrends, 
    getDashboardTransactions 
} from '../controllers/reportController.js';

const reportRouter = express.Router();

// All report routes are admin-only
reportRouter.get('/summary', adminAuth, getDashboardSummary);
reportRouter.get('/analytics', adminAuth, getAnalyticsDetails);
reportRouter.get('/trend', adminAuth, getTrends);
reportRouter.get('/transactions', adminAuth, getDashboardTransactions);

export default reportRouter;
