import express from 'express';
import { checkAuthenticated } from '../middlewares/authentication.js';
import {
  deleteRecord,
  getRecords,
  getRecord,
  getNewRecordForm,
  getUpdateRecord,
  postRecord,
  updateRecord
} from '../controllers/recordController.js';

const router = express.Router();

router.get('/', checkAuthenticated, getRecords);
router.get('/new', checkAuthenticated, getNewRecordForm);

router.get('/:id', checkAuthenticated, getRecord);
router.put('/:id', checkAuthenticated, updateRecord);
router.get('/:id/edit', checkAuthenticated, getUpdateRecord);
router.delete('/:id', checkAuthenticated, deleteRecord);

router.post('/', postRecord);

export default router;