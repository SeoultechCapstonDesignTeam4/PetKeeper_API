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
    return res.status(403);
  }
}

async function normalAuth(req,res,next){
  let userToken = req.headers['authorization'];
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
      return res.status(403).json({
        success: false,
        message: 'not user'
      })
    }
  }catch(err){
    return res.status(403);
  }
}
module.exports ={
  adminAuth,
  normalAuth
}
