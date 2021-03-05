import dotenv from 'dotenv';
import express from 'express';
import { resolve } from 'path';
import configDb from './config/mongodb.js';
import indexRouter from './routers/indexRouter.js';
import activityRouter from './routers/activityRouter.js';
import cameraRouter from './routers/cameraRouter.js';

dotenv.config({ path: resolve() + '/.env' });
const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/activities', activityRouter);
app.use('/cameras', cameraRouter);

const { PORT } = process.env;

configDb()
.then(_ => app.listen(PORT, _ => console.log(`app is running at http://localhost:${PORT}`)))
.catch(_ => console.log('Cannot start Server'));