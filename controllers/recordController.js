import mongoose from 'mongoose';
import Record from '../models/record.js';

let getRecord = async (req, res) => {
  updateRecordStatus();
  const { id } = req.params;
  const record = await Record.findById(id);
  if (record) res.status(200).json(record);
  else res.status(404).json({ message: 'Record not found' });
};

let getRecords = async (_req, res) => {
  updateRecordStatus();
  const records = await Record
    .find()
    .sort([['time', 1]]);

  res.status(200).json(records);
}

let postRecord = async (req, res) => {
  const { startTime, endTime, location, isComplete } = req.body;
  const record = new Record({
    _id: mongoose.Types.ObjectId(),
    startTime,
    endTime,
    location,
    isComplete
  });
  record.save()
    .then(_ => res.status(200).json({ message: 'Record created sucessfully...' }))
    .catch(err => console.log(err));
};

let updateRecordStatus = async () => {
  const records = await Record
    .find({ isComplete: false })

  const currentTime = new Date();

  records.forEach(record => {
    const { _id, startTime, endTime, location } = record;
    if (record.endTime < currentTime) {
      Record.findByIdAndUpdate(
        record._id,
        {
          _id,
          startTime,
          endTime,
          location,
          isComplete: true
        }
      )
        .catch(err => console.log(err));
    }
  })
};

export {
  getRecords,
  getRecord,
  postRecord,
  updateRecordStatus
};