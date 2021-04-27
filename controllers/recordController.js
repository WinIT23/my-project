import mongoose from 'mongoose';
import Record from '../models/record.js';

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  await Record.findByIdAndDelete(id)
    .then(doc => {
      (doc)
        ? res.status(200).json({ message: 'Record deleted sucessfully' })
        : res.status(404).json({ message: 'Record not found' });
    })
    .catch(_ => res.status(500).json({ message: 'Record can\'t be deleted' }));
};

const getRecord = async (req, res) => {
  updateRecordStatus();
  const { id } = req.params;
  const record = await Record.findById(id);
  if (record) res.status(200).json(record);
  else res.status(404).json({ message: 'Record not found' });
};

const getRecords = async (_req, res) => {
  updateRecordStatus();
  const records = await Record
    .find()
    .sort([['time', 1]]);

  res.status(200).render('records', { records });
};

const postRecord = async (req, res) => {
  const { startTime, endTime, location } = req.body;
  const record = new Record({
    _id: mongoose.Types.ObjectId(),
    startTime,
    endTime,
    location,
    isComplete: false
  });
  record.save()
    .then(_ => res.status(200).json({ message: 'Record created sucessfully...' }))
    .catch(err => console.log(err));
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, location } = req.body;
  const currentTime = new Date();

  await Record.findByIdAndUpdate(id, {
    startTime,
    endTime,
    location,
    isComplete: (endTime < currentTime)
  })
    .then(doc => {
      (doc)
        ? res.status(200).json({ message: 'Record updated sucessfully' })
        : res.status(404).json({ message: 'Record not found' });
    })
    .catch(_ => res.status(500).json({ message: 'Record can\'t be updated' }));
};

const updateRecordStatus = async () => {
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
  deleteRecord,
  getRecords,
  getRecord,
  postRecord,
  updateRecord,
  updateRecordStatus
};