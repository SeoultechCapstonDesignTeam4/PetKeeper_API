const jwt = require('jsonwebtoken');
const options ={
  expiresIn: process.env.JWT_EXPIRE
};

async function sign(data){
  return token = await jwt.sign(data,process.env.JWT_SECRET,options);
}
async function verify(token){
  return decoded = await jwt.verify(token,process.env.JWT_SECRET);
}

module.exports={
  sign,
  verify
}