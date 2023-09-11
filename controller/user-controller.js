const userService = require('../service/user-service');
const bcrypt = require('bcrypt');
const jwtUtil = require('../util/jwt-util');
const p_user = require('../models').p_user;
const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');
const sharp = require('sharp');

async function deleteUserImg(req, res) {
  const userInfo = res.locals.userInfo;
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);

    if (userInfo.USER_AUTH == 'admin' || user.USER_ID == userInfo.USER_ID) {
      const target = user.USER_IMAGE.split('/')[3] + '/' + user.USER_IMAGE.split('/')[4];

      if (target !== 'user-profile/default-img') {
        await deleteImg(target);
        await userService.deleteUserImg(id);
      }

      return res.status(200).json({
        success: true,
        message: 'Delete success'
      }).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function uploadUserImg(req, res) {
  const image = req.file;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: 'No file provided'
    }).end();
  }

  const userInfo = res.locals.userInfo;
  const { id } = req.params;
  const key = 'user-profile/' + `${id}_${Date.now()}`;
  const url = 'https://' + process.env.s3_bucket + '.s3.' + process.env.s3_region + '.amazonaws.com/' + key;

  try {
    const user = await userService.getUserById(id);

    if (userInfo.USER_AUTH == 'admin' || user.USER_ID == userInfo.USER_ID) {
      if (user.USER_IMAGE !== null) {
        const target = user.USER_IMAGE.split('/')[3] + '/' + user.USER_IMAGE.split('/')[4];
        await deleteImg(target);
      }

      const buffer = await sharp(image.buffer).resize({ width: 640, height: 640 }).withMetadata().toBuffer();
      await uploadImg(buffer, key, image.mimetype);
      await userService.uploadUserImg(id, url);

      return res.status(200).json(url).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function login(req, res) {
  const { USER_EMAIL, USER_PASSWORD } = req.body;

  try {
    if (!USER_EMAIL || !USER_PASSWORD) {
      throw new Error('Email or password is empty');
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
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
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


async function logout(req, res) {
  const userInfo = res.locals.userInfo;
  await p_user.update({ USER_ACCESSTOKEN: null }, { where: { USER_EMAIL: userInfo.USER_EMAIL } });
  res.setHeader('Authorization', null);
  return res.json({
    success: true,
    message: 'Logout success'
  }).end();
}

async function getUser(req, res) {
  const userInfo = res.locals.userInfo;
  const { id } = req.params;
  try {
    if (userInfo.USER_AUTH == 'admin' || userInfo.USER_ID == id) {
      const data = await userService.getUserById(id);
      return res.status(200).json(data).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function getUsers(req, res) {
  try {
    const data = await userService.getUsers();
    return res.status(200).json(data).end();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function addUser(req, res) {
  const user = req.body;

  try {
    if (!user) {
      throw new Error('User data not found');
    } else if (!user.USER_PHONE || !user.USER_EMAIL || !user.USER_PASSWORD) {
      throw new Error('Phone, email, or password is empty');
    }

    user.USER_PASSWORD = bcrypt.hashSync(user.USER_PASSWORD, 10);

    const data = await userService.addUser(user);
    return res.json(data);
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function updateUser(req, res) {
  const userInfo = res.locals.userInfo;
  const user = req.body;
  const {id} = req.params;

  try {
    if (!user) {
      throw new Error('User data not found');
    } else if (!user.USER_PHONE || !user.USER_EMAIL || !user.USER_PASSWORD) {
      throw new Error('Phone, email, or password is empty');
    }

    if (userInfo.USER_AUTH == 'admin' || userInfo.USER_ID == id) {
      user.USER_PASSWORD = bcrypt.hashSync(user.USER_PASSWORD, 10);
      const data = await userService.updateUser(user,id);
      return res.status(200).json(data).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function deleteUser(req, res) {
  const userInfo = res.locals.userInfo;
  const userId = userInfo.USER_ID;
  const { id } = req.params;
  try {
    if (userInfo.USER_AUTH == 'admin' || userInfo.USER_ID == id) {
      const data = await userService.deleteUser(id);
      return res.status(200).json(data).end();
    } else {
      throw new Error('Permission denied');
    }
  } catch (err) {
    console.log(err.message)
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
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