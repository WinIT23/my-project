import mongoose from 'mongoose';
import Camera from '../models/camera.js';
import Activity from '../models/activity.js';

let getActivity = async (req, res) => {
  const { id } = req.params;

  const activity = await Activity.findById(id).populate('camera');
  if (activity) res.status(200).json(activity);
  else res.status(404).json({ message: 'Activity not found' });
};

let getActivities = async (_req, res) => {
  const activities = await Activity
    .find({ isInRecord: false })
    .populate('camera')
    .sort([['time', 1]]);
    
    res.status(200).json(activities);
  // Activity.find({ location: { $geoWithin: { $centerSphere: [[-73.93414657, 40.82302903], [miles] / 3963.2] } } })
}

let postActivity = async (req, res) => {
  const { cameraId, personCount, isInRecord } = req.body;
  const camera = await Camera.findById(cameraId);
  if (camera) {
    const activity = new Activity({
      _id: mongoose.Types.ObjectId(),
      camera,
      personCount,
      time: Date.now(),
      isInRecord
    });
    activity.save()
      .then(_ => res.status(200).json({ message: 'Activity created sucessfully...' }))
      .catch(err => console.log(err));
  }
};

export {
  getActivities,
  getActivity,
  postActivity
};