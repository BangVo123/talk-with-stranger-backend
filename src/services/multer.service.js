const multer = require("multer");
const path = require("path");

const MAX_FILE_SIZE = 1024 * 1024 * 25;

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);

    cb(null, `user-${req.user.userId}-${Date.now()}${fileExt}`);
  },
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = {
  uploadDisk,
  uploadMemory,
};
