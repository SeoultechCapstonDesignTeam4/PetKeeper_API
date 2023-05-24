const jwt = require('jsonwebtoken');
const options ={
  expiresIn: process.env.jwtExpire
};

async function sign(data){
  return token = await jwt.sign(data,process.env.jwtSecret,options);
}
async function verify(token){
  return decoded = await jwt.verify(token,process.env.jwtSecret);
}

module.exports={
  sign,
  verify
}