const userService = require('../service/user-service');
const bcrypt = require('bcrypt');
const jwtUtil = require('../util/jwt-util');
const p_user = require('../models').p_user;
const {handleErrorResponse,permissionCheck,getCurrentDate } = require('../util/error');
const {uploadS3Img,deleteS3Img} = require('../util/s3-util');
const {sendEmail} = require('../util/mail-js');
const {createResetToken,verifyResetToken,deleteResetToken, generateRandomString} = require('../util/redis');
const {formatDateFromAndroid,formatPhoneNumber} = require('../util/date_phone');
const dirName = 'user-profile';

async function login(req, res) {
  const { USER_EMAIL, USER_PASSWORD } = req.body;

  try {
    if (!USER_EMAIL || !USER_PASSWORD) {
      throw new Error('Email or password is not found');
    }

    const user = await userService.getUserByEmail(USER_EMAIL);
    const isPasswordMatch = bcrypt.compareSync(USER_PASSWORD, user.USER_PASSWORD);

    if (isPasswordMatch) {
      const token = await generateToken(user);
      const userInformation = await userService.getUserById(user.USER_ID);
      await p_user.update({ USER_ACCESSTOKEN: token }, { where: { USER_EMAIL: user.USER_EMAIL } });

      res.setHeader('Authorization', `Bearer ${token}`);
      // return res.status(200).json({ token:token, USER: userInformation }).end();
      return res.redirect('/admin/userList');
    } else {
      throw new Error('Password does not match');
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function userList(req,res){
  // const userInfo = res.locals.userInfo;
  try{
    const data = await userService.getUsers();
    const plainData = data.map(user => user.get());
    console.log(plainData[0].USER_EMAIL)
    res.render('user/userList',{
      data:plainData
    })
  }catch(err){
    handleErrorResponse(err,res);
  }
}

module.exports={
  login,
  userList
}