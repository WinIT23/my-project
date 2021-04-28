import express from 'express';
import { checkAuthenticated } from '../middlewares/authentication.js';
import {
  deleteActivity,
  getActivities,
  getActivity,
  postActivity,
  resolveActivity,
  updateActivity
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/', checkAuthenticated, getActivities);

router.get('/:id', checkAuthenticated, getActivity);
router.put('/:id', checkAuthenticated, updateActivity);
router.delete('/:id', checkAuthenticated, deleteActivity);

router.post('/:id/resolve', checkAuthenticated, resolveActivity);

router.post('/new', postActivity);

export default router;