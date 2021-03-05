import express from 'express';
import { getIndex } from '../controllers/indexController.js';
import { checkAuthenticated } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/', checkAuthenticated, getIndex);

export default router;