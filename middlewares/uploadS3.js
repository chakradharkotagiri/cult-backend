// middlewares/uploadS3.js
const multer = require('multer');

const uploadS3 = (folder) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
    },
  });
};

module.exports = uploadS3;
