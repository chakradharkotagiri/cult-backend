// utils/s3Uploader.js

const AWS = require('aws-sdk');

// Initialize S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g., 'ap-south-1'
});

/**
 * Uploads file to S3 using multer.memoryStorage()
 * @param {Object} file - file from multer
 * @param {string} folderPath - path in S3 bucket
 * @returns {Promise<string>} - public S3 URL
 */
const uploadToS3 = async (file, folderPath) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  const Key = `${folderPath}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read', // ✅ public URL
  };

  await s3.upload(params).promise();

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};

module.exports = { uploadToS3, s3 }; // ✅ also export s3 instance
