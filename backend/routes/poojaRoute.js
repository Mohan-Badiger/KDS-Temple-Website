import express from 'express';
import {allPoojas, addPooja, removePooja, updatePooja, getPoojaById} from '../controllers/poojaController.js';
import upload from '../middleware/multer.js';

const poojaRouter = express.Router();

poojaRouter.get('/all', allPoojas);
poojaRouter.get('/:id', getPoojaById); 
poojaRouter.post('/add', upload.single('image'), addPooja);
poojaRouter.delete('/remove/:id', removePooja);
poojaRouter.put('/update/:id', upload.single('image'), updatePooja); 
  

export default poojaRouter;