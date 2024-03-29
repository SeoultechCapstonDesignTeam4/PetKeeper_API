const userService = require('../../service/user-service');

async function adminAuth(req,res,next){
  let userToken = req.headers['authorization'];
  if(!userToken){
    // throw new Error('not logged in');
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    })
  }else{
    userToken = userToken.split(' ')[1];
  }
  try{
    const user = await userService.getUserByToken(userToken);
    if(user.USER_AUTH === 'admin'){
      res.locals.userInfo = user.dataValues;
      return next();
    }else{
      throw new Error('not admin');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }
}

async function normalAuth(req,res,next){
  let userToken = req.headers['authorization'];
  console.log(userToken);
  if(!userToken){
    return res.status(403).json({
      success: false,
      message: 'not logged in'
    })
  }else{
    userToken = userToken.split(' ')[1];
  }
  try{
    const user = await userService.getUserByToken(userToken);
    if(user.USER_AUTH === 'normal' || user.USER_AUTH === 'admin'){
      res.locals.userInfo = user.dataValues;
      return next();
    }else{
      throw new Error('not even user');
    }
  }catch(err){
    console.log(err);
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }
}
module.exports ={
  adminAuth,
  normalAuth
}
