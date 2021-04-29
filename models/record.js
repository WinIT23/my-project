import mongoose from 'mongoose';
const { model, Schema, Types } = mongoose;

const Record = new Schema({
  _id: Types.ObjectId,
  startTime: Date,
  endTime: Date,
  location: Object,
  isComplete: Boolean,
  description: String
});

export default model('Records', Record);