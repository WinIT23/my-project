import dotenv from 'dotenv';
import { resolve } from 'path';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import configDb from './config/mongodbConfig.js';
import methodOverride from 'method-override';
import express, { urlencoded } from 'express';
import authRouter from './routers/authRouter.js';
import indexRouter from './routers/indexRouter.js';
import recordRouter from './routers/recordRouter.js';
import cameraRouter from './routers/cameraRouter.js';
import activityRouter from './routers/activityRouter.js';
import initializePassport from './config/passportConfig.js';
import cameraRouterAPI from './routers/api/cameraRouter.js';
import recordRouterAPI from './routers/api/recordRouter.js';
import activityRouterAPI from './routers/api/activityRouter.js';

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

dotenv.config({ path: resolve() + '/.env' });
const app = express();

app.use(express.static('./public'));
app.use('/uploads', express.static('./uploads'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Server Running status check
app.get('/api/health', (_req, res) => { res.status(200).json({ message: 'Server is running fine...' }) })

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/activities', activityRouter);
app.use('/cameras', cameraRouter);
app.use('/records', recordRouter)

app.use('/api/activities', activityRouterAPI);
app.use('/api/cameras', cameraRouterAPI);
app.use('/api/records', recordRouterAPI)

const { PORT } = process.env;

configDb()
  .then(_ => app.listen(PORT, _ => console.log(`app is running at ${process.env.HOST_URL}`)))
  .catch(_ => console.log('Cannot start Server'));