import dotenv from 'dotenv';
import { resolve } from 'path';
import { getActivitiesList } from './activityController.js';

dotenv.config({ path: resolve() + '/.env' });

const getIndex = async (req, res) => {
  const cameraGroups = await getActivitiesList();
  res.render('index', { MAPS_API_KEY: process.env.MAPS_API_KEY, user: req.user, cameraGroups });
};

export {
  getIndex
};