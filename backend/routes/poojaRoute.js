import express from 'express';
import {allPoojas, addPooja, removePooja, updatePooja, getPoojaById, updatePoojaAvailability, bulkUpdatePoojaAvailability} from '../controllers/poojaController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const poojaRouter = express.Router();

poojaRouter.get('/all', allPoojas);
poojaRouter.put('/update-availability', adminAuth, updatePoojaAvailability);
poojaRouter.put('/bulk-update-availability', adminAuth, bulkUpdatePoojaAvailability);
poojaRouter.get('/:id', getPoojaById); 
poojaRouter.post('/add', adminAuth, upload.single('image'), addPooja);
poojaRouter.delete('/remove/:id', adminAuth, removePooja);
poojaRouter.put('/update/:id', adminAuth, upload.single('image'), updatePooja); 

export default poojaRouter;