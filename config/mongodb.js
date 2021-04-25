import dotenv from 'dotenv';
import mongoose from 'mongoose';

const { connect } = mongoose;
dotenv.config();

const configDb = async () => {
  return new Promise((resolve, reject) => {
    connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
      .then(_ => {
        console.log('Database connection Successful!!!');
        resolve(true);
      })
      .catch(_ => {
        console.log('Database connection Failed!!!');
        reject(false);
      })
  })
};

export default configDb;