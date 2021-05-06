import { rename } from 'fs';
import mongoose from 'mongoose';
import Camera from '../../models/camera.js';
import Record from '../../models/record.js';
import Activity from '../../models/activity.js';
import { updateRecordStatus } from './recordControlle.js';

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
    ? res.status(200).json(activity)
    : res.status(404).json({ message: 'Activity not found' });
};

// TODO: add a route to get all activities...

const getActivities = async (_req, res) => {
  const activities = await Activity
    .find({ isInRecord: false, isResolved: false })
    .populate('camera')
    .sort([['time', -1]]);

  const cameras = await Camera
    .find()

  const cameraGroups = {
    length: 0,
    data: []
  }

  cameras.forEach(camera => {
    const activityList = activities.filter(activity => String(activity.camera._id) === String(camera._id))
    cameraGroups.data.push({
      id: camera._id,
      location: camera.location,
      activities: activityList 
    })
  })
  cameraGroups.length = cameraGroups.data.length
  
  if (cameraGroups.length)
    res.status(200).json(cameraGroups)
  else
    res.status(404).json({ message: 'No Activities found' });
};

const postActivity = async (req, res) => {
  updateRecordStatus();

  const id = mongoose.Types.ObjectId();
  const { cameraId, personCount } = req.body;
  const oldFileName = `${req.file.filename}`;
  const newFileName = `${ id }.${ req.file.filename.split('.')[1]}`
  const imageURL = `/${process.env.UPLOAD_DIR}${newFileName}`
  const time = new Date();
  let isInRecord = false;
  
  const camera = await Camera
    .findById(cameraId);
  const records = await Record
    .find({ location: camera.location });

  records.forEach(record => {
    isInRecord = (time >= record.startTime && time <= record.endTime);
  });

  rename(
    process.env.UPLOAD_DIR + oldFileName,
    process.env.UPLOAD_DIR + newFileName,
    () => {
      console.log(`New File Added : ${process.env.UPLOAD_DIR + newFileName}`);
    })

  if (camera) {
    const activity = new Activity({
      _id: id,
      camera,
      personCount,
      time,
      isInRecord,
      imageURL,
      isResolved: isInRecord
    });

    activity.save()
      .then(_ => res.status(200).json({ message: 'Activity created sucessfully', url: `${process.env.HOST_URL}/api/activities/${id}` }))
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
    .then(_ => res.status(200).json({ message: 'Activity Resolved sucessfully' }))
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
  getActivity,
  postActivity,
  resolveActivity,
  updateActivity
};