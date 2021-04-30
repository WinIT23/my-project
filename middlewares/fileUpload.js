import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    const filename = req.body.cameraId;
    const fileType = file.originalname.split('.')[1];
    cb(null, `${filename}.${fileType}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
    cb(null, true)
  else 
    cb(null, false)
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;