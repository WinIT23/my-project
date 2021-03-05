import mongoose from 'mongoose';
const { model, Schema, Types } = mongoose;

// can remove location by using cameraId here and 
const Activity = new Schema({
  _id: Types.ObjectId,
  camera: { type: Types.ObjectId, ref: 'Cameras' },
  time: Date,
  personCount: Number,
  isInRecord: Boolean
});

export default model('Activities', Activity);