import express from 'express';
import upload from '../../middlewares/fileUpload.js';
import {
  deleteActivity,
  getActivities,
  getActivity,
  postActivity,
  resolveActivity,
  updateActivity
} from '../../controllers/api/activityController.js';

const router = express.Router();

router.get('/', getActivities);

router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

router.post('/:id/resolve', resolveActivity);

router.post('/new', upload.single('crowdImage'), postActivity);

export default router;