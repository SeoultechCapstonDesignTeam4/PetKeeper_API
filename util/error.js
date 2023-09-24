/**
 * Handle errors and send appropriate response based on the error message.
 * 
 * @param {Error} err - Error object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
function handleErrorResponse(err, res) {
  let statusCode = 500;  // Default status code as internal server error
  if (err.message.includes('permission denied')) statusCode = 403;  // Permission error
  if (err.message.includes('not found')) statusCode = 404;  // Resource not found error
  // Add more error branchings if needed
  
  return res.status(statusCode).json({
      success: false,
      message: err.message
  }).end();
}

/**
 * Checks if the user has the necessary permissions based on their role and ID.
 *
 * @param {string} USER_AUTH - User's role or authorization level.
 * @param {string} USER_ID - User's unique ID.
 * @param {string} id - Target user or resource's ID that the user wishes to access.
 * @returns {boolean} - True if the user has the necessary permissions, otherwise throws an error.
 */
function permissionCheck(USER_AUTH, USER_ID, id) {
  if (USER_AUTH === 'admin' || USER_ID === id) {
    return true;
  }
  throw new Error('permission denied');
}

function getCurrentDate() {
  const koreanOffset = 9 * 60; // Korea is UTC+9
  const today = new Date(new Date().getTime() + koreanOffset * 60 * 1000);
  
  const yyyy = today.getUTCFullYear();
  const mm = String(today.getUTCMonth() + 1).padStart(2, '0'); 
  const dd = String(today.getUTCDate()).padStart(2, '0');
  const hh = String(today.getUTCHours()).padStart(2, '0');
  const min = String(today.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');

function generateS3URL(key) {
  return `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/${key}`;
}

async function uploadImage(image, dirName,USER_ID) {
  const key = `${dirName}/${USER_ID}_${Date.now()}`;
  const url = generateS3URL(key);
  const buffer = await sharp(image.buffer).resize({width:640,height:640}).withMetadata().toBuffer();
  await uploadImg(buffer, key, image.mimetype);
  return url;
}

async function deleteImage(imageUrl) {
  const target = imageUrl.split('/')[3] + "/" + imageUrl.split('/')[4];
  await deleteImg(target);
}



module.exports = {
  handleErrorResponse,
  permissionCheck,
  getCurrentDate,
  uploadImage,
  deleteImage
}
