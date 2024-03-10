import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

interface Params {
  Bucket: string;
  Body?: fs.ReadStream;
  Key: string;
}

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const FileTransfer = {
  uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams: Params = {
      Bucket: bucketName!,
      Body: fileStream!,
      Key: file.filename
    };

    return s3.upload(uploadParams).promise();
  },

  getFile(fileKey) {
    const downloadParams: Params = {
      Key: fileKey,
      Bucket: bucketName!
    };

    return s3.getObject(downloadParams).createReadStream();
  }
};

export default FileTransfer;
