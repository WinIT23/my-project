import express from 'express';
import {
  deleteActivity,
  getActivities,
  getActivity,
  postActivity,
  updateActivity
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/', getActivities);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);
router.post('/new', postActivity);

export default router;