const { DeleteObjectCommand,PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');

const accessKeyId = process.env.s3_accessKeyId ? process.env.s3_accessKeyId : "";
const secretAccessKey = process.env.s3_secretAccessKey ? process.env.s3_secretAccessKey:"";
const region = process.env.s3_region ? process.env.s3_region : "";
const bucket = process.env.s3_bucket? process.env.s3_bucket : "";

const s3 = new S3Client({
  region:region,
  credentials: {
    accessKeyId:accessKeyId,
    secretAccessKey: secretAccessKey
  }
});

function imageReq(dirPath){
  return multer({
    limits: {fileSize: 5* 1024 * 1024}
  });
}
 
async function uploadImg(buffer, key,mimetype) {
  try{
    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ACL: "public-read",
      ContentType: mimetype,
      Metadata: {
        "x-amz-meta-my-key": "resized",
      },
    };
    await s3.send(new PutObjectCommand(params));
    console.log(`Succesfully uploaded to ${key}, returned Key`);
    return key;
  }catch(err){
    throw err;
  }
}

async function deleteImg(key){
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  })
  try{
    const response = await s3.send(command);
  }catch(err){
    console.log(err.message);
    throw err;
  }
}

module.exports ={
  imageReq,
  uploadImg,
  deleteImg,
  s3
}