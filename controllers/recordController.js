import mongoose from 'mongoose';
import Record from '../models/record.js';

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  await Record.findByIdAndDelete(id)
    .then(doc => {
      (doc)
        ? res.redirect('/records')
        : res.status(404).json({ message: 'Record not found' });
    })
    .catch(_ => res.status(500).json({ message: 'Record can\'t be deleted' }));
};

const getRecord = async (req, res) => {
  updateRecordStatus();
  const { id } = req.params;
  const record = await Record.findById(id);
  if (record)
    res.status(200).render('record', { record });
  else
    res.status(404).json({ message: 'Record not found' });
};

const getRecords = async (_req, res) => {
  updateRecordStatus();
  const records = await Record
    .find()
    .sort([['time', 1]]);

  res.status(200).render('records', { records });
};

const getNewRecordForm = (_req, res) => {
  res.render('recordsForm', { isEdit: false })
}

const getUpdateRecord = async (req, res) => {
  const { id } = req.params;
  const { _id, startTime, endTime, location, description } = await Record.findById(id);
  const record = {
    _id,
    startTime: startTime.toISOString().split('.')[0],
    endTime: endTime.toISOString().split('.')[0],
    location,
    description
  };
  res.render('recordsForm', { isEdit: true, record })
}

const postRecord = async (req, res) => {
  const { startTime, endTime, locationStr, description } = req.body;
  const location = {
    type: "Point",
    coordinates: [...locationStr.split(' ').map(coord => parseFloat(coord))]
  }
  const record = new Record({
    _id: mongoose.Types.ObjectId(),
    startTime,
    endTime,
    location,
    description,
    isComplete: false
  });
  record.save()
    .then(doc => res.redirect(`/records/${doc._id}`))
    .catch(err => console.log(err));
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, locationStr, description } = req.body;
  const currentTime = new Date();
  const location = {
    type: "Point",
    coordinates: [...locationStr.split(' ').map(coord => parseFloat(coord))]
  }
  await Record.findByIdAndUpdate(id, {
    startTime,
    endTime,
    location,
    description,
    isComplete: (endTime < currentTime)
  })
    .then(doc => {
      (doc)
        ? res.redirect(`/records/${id}`) // redirect records/:id
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
  getNewRecordForm,
  getUpdateRecord,
  postRecord,
  updateRecord,
  updateRecordStatus
};