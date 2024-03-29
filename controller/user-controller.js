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

async function deleteUserImg(req, res) {
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const { TARGET_USER_ID } = req.params;

  try {
    const user = await userService.getUserById(TARGET_USER_ID);
    
    if (permissionCheck(USER_AUTH, USER_ID, user.USER_ID)) {
      const target = user.USER_IMAGE.split('/')[3] + '/' + user.USER_IMAGE.split('/')[4];

      if (target !== 'user-profile/default-img') {
        await deleteS3Img(user.USER_IMAGE);
        await userService.deleteUserImg(TARGET_USER_ID);
      }
      return res.status(200).json({
        success: true,
        message: 'Delete success'
        
      }).end();
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function uploadUserImg(req, res) {
  const image = req.file;
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const { TARGET_USER_ID } = req.params;

  try {
    if (!image) {
      throw new Error('File not found');
    }
    const user = await userService.getUserById(TARGET_USER_ID);
    if (permissionCheck(USER_AUTH, USER_ID, user.USER_ID)) {
      if (user.USER_IMAGE !== null) {
        await deleteS3Img(user.USER_IMAGE);
      }
      await uploadS3Img(image,dirName,TARGET_USER_ID);
      await userService.uploadUserImg(TARGET_USER_ID, url);
      return res.status(200).json(url).end();
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

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
      return res.status(200).json({ token:token, USER: userInformation }).end();
    } else {
      throw new Error('Password does not match');
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

//generate token
async function generateToken(user) {
  const data = {
    email: user.USER_EMAIL,
    id: user.USER_ID,
    phone: user.USER_PHONE,
    name: user.USER_NAME
  };

  const token = await jwtUtil.sign(data);
  return token;
}

async function forgetEmail(req, res) {
  const { USER_PHONE, USER_NAME } = req.body;
  try {
    if (!USER_NAME || !USER_PHONE) throw new Error('Name or phone is not found');
    const user = await userService.getUserByPhone(USER_PHONE);
    if(user.USER_NAME != USER_NAME){
      throw new Error('Name does not match');
    }
    return res.status(200).json({
      success: true,
      message: 'User found',
      USER_EMAIL: user.USER_EMAIL
    }).end();
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function forgetPassword(req, res) {
  const { USER_EMAIL, USER_NAME,USER_PHONE } = req.body;
  console.log(req.body);
  try {
    if (!USER_EMAIL) throw new Error('Email is not found');
    if (!USER_NAME || !USER_PHONE) throw new Error('Name or Phone is not found');
    const check = await userService.getUserByEmail(USER_EMAIL);
    if (check.USER_NAME != USER_NAME || check.USER_PHONE != USER_PHONE) throw new Error('Name or Phone does not match');

    const data = {
      USER_ID: check.USER_ID,
      USER_EMAIL: check.USER_EMAIL
    };

    const token = await createResetToken(data);
    await sendEmail(USER_EMAIL, `[비밀번호 리셋]${USER_EMAIL}`, `https://petkeeper.co.kr/user/forget/callback?email=${USER_EMAIL}&token=${token}`);
    return res.status(200).json({ message: '비밀번호 리셋 이메일이 발송되었습니다. 내용에 나와있는 URL을 클릭해주세요' }).end();
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function verifyToken(req,res){
  const {email, token} = req.query;
  try{
    const user = await verifyResetToken(email, token);
    const newPassword = generateRandomString(10);
    user.USER_PASSWORD = bcrypt.hashSync(newPassword, 10);
    user.USER_ACCESSTOKEN = null;
    await userService.updateUser(user,user.USER_ID).then(()=>{
      deleteResetToken(email);
    });
    const result = {
      USER_EMAIL: email,
      USER_PASSWORD: newPassword,
      message: '비밀번호가 리셋되었습니다. 다시 로그인해주세요'
    }
    return res.status(200).json(result).end();
  }catch(err){
    handleErrorResponse(err,res);
  }
}

async function logout(req, res) {
  const {USER_ID} = res.locals.userInfo;
  await p_user.update({ USER_ACCESSTOKEN: null }, { where: { USER_ID: 
  USER_ID } });
  res.setHeader('Authorization', null);
  return res.json({
    success: true,
    message: 'Logout success'
  }).end();
}

async function getUser(req, res) {
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  
  const { TARGET_USER_ID } = req.params;
  console.log(USER_AUTH, USER_ID, TARGET_USER_ID);
  try {
    if (permissionCheck(USER_AUTH, USER_ID, TARGET_USER_ID)) {
      const data = await userService.getUserById(TARGET_USER_ID);
      return res.status(200).json(data).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function getUsers(req, res) {
  try {
    const data = await userService.getUsers();
    return res.status(200).json(data).end();
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function addUser(req, res) {
  const user = req.body;
  const now = getCurrentDate();
  user.USER_PHONE = formatPhoneNumber(res,user.USER_PHONE);
  try {
    if (!user) {
      throw new Error('User data not found');
    } else if (!user.USER_PHONE || !user.USER_EMAIL || !user.USER_PASSWORD) {
      throw new Error('Phone, email, or password is not found');
    }
    user.USER_DATE = now[0];
    user.USER_TIME = now[1];
    user.USER_PASSWORD = bcrypt.hashSync(user.USER_PASSWORD, 10);
    const data = await userService.addUser(user);
    data.USER_PASSWORD = '********';
    return res.status(200).json(data);
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function updateUser(req, res) {
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const user = req.body;
  const {TARGET_USER_ID} = req.params;

  try {
    if (!user) {
      throw new Error('User data not found');
    } else if (!user.USER_PHONE || !user.USER_EMAIL || !user.USER_PASSWORD) {
      throw new Error('Phone, email, or password is not found');
    }

    if (permissionCheck(USER_AUTH, USER_ID, TARGET_USER_ID)) {
      user.USER_PASSWORD = bcrypt.hashSync(user.USER_PASSWORD, 10);
      const data = await userService.updateUser(user,TARGET_USER_ID);
      const userInformation = await userService.getUserById(TARGET_USER_ID);
      data.USER_PASSWORD = '********';
      return res.status(200).json({
        token:userInformation.USER_ACCESSTOKEN,
        USER:userInformation
      }).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}

async function deleteUser(req, res) {
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const { TARGET_USER_ID } = req.params;
  try {
    if (permissionCheck(USER_AUTH, USER_ID, TARGET_USER_ID)) {
      const data = await userService.deleteUser(TARGET_USER_ID);
      return res.status(200).json(data).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    handleErrorResponse(err, res);
  }
}



module.exports ={
  login,
  logout,
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  uploadUserImg,
  deleteUserImg,
  forgetPassword,
  verifyToken,
  forgetEmail
}