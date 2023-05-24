
function errorCall(call){
  let status;
  let message;
  switch(message){
    case 'permission':
      message = 'permission denied';
      status = 403;
      break;
    case 'email':
      message = 'email not found';
      status = 403;
      break;
    case 'password':
      message = 'password not match';
      status = 403;
      break;
    case 'user':
      message = 'user not found';
      status = 404;
      break;
    case 'userdata':
      message = 'user data not found';
      status = 404;
      break;
    case 'file':
      message = 'file not found';
      status = 404;
      break;
  }
  return message,status;
}
module.exports={
  errorCall
}