import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve() + '/.env' });

const getIndex = (req, res) => {
  res.render('index', { MAPS_API_KEY: process.env.MAPS_API_KEY, user: req.user });
};

export {
  getIndex
};