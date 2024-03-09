import multer from 'multer';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.body.error = 'An error occurred! File must be a png or jpeg.';
    }
  }
});

export default upload;
