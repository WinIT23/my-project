import mongoose from 'mongoose';
const { model, Schema, Types } = mongoose;

const Camera = new Schema({
  _id: Types.ObjectId,
  location: Object
});

export default model('Cameras', Camera);

// demo cameraIds,

// 60411dba2a195502dc95697f
// 60412dc961d2be0ff3915554