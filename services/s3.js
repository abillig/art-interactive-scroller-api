if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const S3 = require("aws-sdk/clients/s3");
const sharp = require("sharp");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKeyId = process.env.AWS_SECRET_KEY;

var s3 = new S3({
  region,
  accessKeyId,
  secretAccessKeyId,
});

const uploadFile = async (file) => {
  const resizedFile = await sharp(file.path).png().resize(null, 500).toBuffer();

  const uploadParams = {
    Bucket: bucketName,
    Body: resizedFile,
    Key: file.filename, // key is the name of the file within the s3 bucket
  };

  return s3.upload(uploadParams).promise();
  // calling .promise on upload allows you to return a promise rather than having to use callback functions
};

const getFileStream = (file) => {
  const downloadParams = {
    Bucket: bucketName,
    Key: file,
  };

  return s3.getObject(downloadParams).createReadStream();
};

exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
