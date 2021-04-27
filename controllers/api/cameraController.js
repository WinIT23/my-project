import mongoose from 'mongoose';
import Camera from '../../models/camera.js';

const getCamera = async (req, res) => {
  const { id } = req.params;
  const camera = await Camera.findById(id);
  if (camera) res.status(200).json(camera);
  else res.status(404).json({ message: 'Camera not found' });
};

const getCameras = async (_req, res) => {
  const activities = await Camera.find();
  res.status(200).json(activities);
}

const postCamera = async (req, res) => {
  const { location } = req.body;
    const camera = new Camera({
      _id: mongoose.Types.ObjectId(),
      location
    });
    camera.save()
      .catch(err => console.log(err));
  res.status(200).json({ message: 'Camera created sucessfully...' });
};

export {
  getCameras,
  getCamera,
  postCamera
};