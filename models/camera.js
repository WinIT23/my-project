import mongoose from 'mongoose';
const { model, Schema, Types } = mongoose;

const Camera = new Schema({
  _id: Types.ObjectId,
  location: Object
});

export default model('Cameras', Camera);