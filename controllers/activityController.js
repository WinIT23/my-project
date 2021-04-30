import mongoose from 'mongoose';
import Camera from '../models/camera.js';
import Record from '../models/record.js';
import Activity from '../models/activity.js';
import { updateRecordStatus } from '../controllers/recordController.js';

const deleteActivity = async (req, res) => {
  const { id } = req.params;
  await Activity
    .findByIdAndDelete(id)
    .then(doc => {
      (doc)
        ? res.status(200).json({ message: 'Activity deleted sucessfully' })
        : res.status(404).json({ message: 'Activity not found' });
    })
    .catch(_ => res.status(500).json({ message: 'Activity can\'t be deleted' }));
};

const getActivity = async (req, res) => {
  const { id } = req.params; 
  const doc = await Activity.findById(id).populate('camera');
  const activity = {
    ...doc._doc,
    imageURL: `${process.env.HOST_URL}${doc.imageURL}`
  };
  (activity)
    ? res.status(200).render('activity', { activity })
    : res.status(404).json({ message: 'Activity not found' });
};

// TODO: add a route to get all activities...

const getActivities = async (_req, res) => {
  const activities = await Activity
    .find({ isInRecord: false, isResolved: false })
    .populate('camera')
    .sort([['time', 1]]);
  (activities.length)
    ? res.status(200).render('activities', { activities })
    : res.status(404)
};

const getActivitiesList = async () => {
  return await Activity
    .find({ isInRecord: false, isResolved: false })
    .populate('camera')
    .sort([['time', 1]]);
};

const postActivity = async (req, res) => {
  updateRecordStatus();

  const { cameraId, personCount } = req.body;
  const time = new Date();
  let isInRecord = false;

  const camera = await Camera
    .findById(cameraId);
  const records = await Record
    .find({ location: camera.location });

  records.forEach(record => {
    isInRecord = (time >= record.startTime && time <= record.endTime);
  });

  if (camera) {
    const activity = new Activity({
      _id: mongoose.Types.ObjectId(),
      camera,
      personCount,
      time,
      isInRecord,
      isResolved: isInRecord
    });
    activity.save()
      .then(_ => res.status(200).json({ message: 'Activity created sucessfully' }))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Activity can\'t be deleted' })
      });
  } else {
    res.status(404).json({ message: 'Camera-ID Invalid' })
  }
};

const resolveActivity = (req, res) => {
  const { id } = req.params;
  Activity.findByIdAndUpdate(id,
    { isResolved: true }
  )
    .then(_ => res.redirect('/'))
    .catch(_ => res.status(500).json({ message: 'Activity can\'t be updated' }));
}

const updateActivity = (req, res) => {
  const { id } = req.params;
  const { personCount, isResolved } = req.body;

  Activity.findByIdAndUpdate(id, {
    personCount,
    isResolved
  })
    .then(doc => {
      (doc)
        ? res.status(200).json({ message: 'Activity updated sucessfully' })
        : res.status(404).json({ message: 'Activity not found' });
    })
    .catch(_ => res.status(500).json({ message: 'Activity can\'t be updated' }));
};

export {
  deleteActivity,
  getActivities,
  getActivitiesList,
  getActivity,
  postActivity,
  resolveActivity,
  updateActivity
};