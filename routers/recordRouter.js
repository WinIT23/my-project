import express from 'express';
import { getRecords, getRecord, postRecord } from '../controllers/recordController.js';

const router = express.Router();

router.get('/', getRecords);
router.get('/:id', getRecord);
router.post('/new', postRecord);

export default router;