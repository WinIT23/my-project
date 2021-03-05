import express from 'express';
import { getActivities, getActivity, postActivity } from '../controllers/activityController.js';

const router = express.Router();

router.get('/', getActivities);
router.get('/:id', getActivity);
router.post('/new', postActivity);

export default router;