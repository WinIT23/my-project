import express from 'express';
import {
  deleteRecord,
  getRecords,
  getRecord,
  postRecord,
  updateRecord
} from '../controllers/recordController.js';

const router = express.Router();

router.get('/', getRecords);
router.get('/:id', getRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);
router.post('/new', postRecord);

export default router;