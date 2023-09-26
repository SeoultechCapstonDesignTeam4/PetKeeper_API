const userService = require('../service/user-service');
const bcrypt = require('bcrypt');
const jwtUtil = require('../util/jwt-util');
const p_user = require('../models').p_user;
const {handleErrorResponse,permissionCheck,getCurrentDate } = require('../util/error');
const {uploadS3Img,deleteS3Img} = require('../util/s3-util');

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

      await p_user.update({ USER_ACCESSTOKEN: token }, { where: { USER_EMAIL: user.USER_EMAIL } });

      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({ token }).end();
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

  const token =    await jwtUtil.sign(data);
  return token;
}


async function logout(req, res) {
  const {USER_EMAIL} = res.locals.userInfo;
  await p_user.update({ USER_ACCESSTOKEN: null }, { where: { USER_EMAIL: USER_EMAIL } });
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
      data.USER_PASSWORD = '********';
      return res.status(200).json(data).end();
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
}