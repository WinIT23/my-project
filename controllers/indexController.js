import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve() + '/.env' });

let getIndex = (_req, res) => {
  res.render('index', { MAPS_API_KEY: process.env.MAPS_API_KEY });
};

export { 
  getIndex
};