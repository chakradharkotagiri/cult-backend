

const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, 
});

const uploadToS3 = async (file, folderPath) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  const Key = `${folderPath}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  
  };

  await s3.upload(params).promise();

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};

module.exports = { uploadToS3, s3 }; 
