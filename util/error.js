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

module.exports = {
  handleErrorResponse,
  permissionCheck,
  getCurrentDate,
}
