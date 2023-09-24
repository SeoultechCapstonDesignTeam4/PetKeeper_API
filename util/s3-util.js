const sharp = require('sharp');
const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');

function generateS3URL(key) {
  return `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/${key}`;
}

async function uploadS3Image(image, dirName,USER_ID) {
  const key = `${dirName}/${USER_ID}_${Date.now()}`;
  const url = generateS3URL(key);
  const buffer = await sharp(image.buffer).resize({width:640,height:640}).withMetadata().toBuffer();
  await uploadImg(buffer, key, image.mimetype);
  return url;
}

async function deleteS3Image(imageUrl) {
  const target = imageUrl.split('/')[3] + "/" + imageUrl.split('/')[4];
  await deleteImg(target);
}

module.exports = {
  uploadS3Image,
  deleteS3Image
}