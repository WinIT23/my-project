import express from 'express';
import { checkAuthenticated } from '../middlewares/authentication.js';
import {
  deleteRecord,
  getRecords,
  getRecord,
  postRecord,
  updateRecord
} from '../controllers/recordController.js';

const router = express.Router();

router.get('/', checkAuthenticated, getRecords);

router.get('/:id', checkAuthenticated, getRecord);
router.put('/:id', checkAuthenticated, updateRecord);
router.delete('/:id', checkAuthenticated, deleteRecord);

router.post('/new', postRecord);

export default router;