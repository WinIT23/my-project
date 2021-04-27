import express from 'express';
import { getCameras, getCamera, postCamera } from '../../controllers/api/cameraController.js';

const router = express.Router();

router.get('/', getCameras);

router.get('/:id', getCamera);

router.post('/new', postCamera);

export default router;