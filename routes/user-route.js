var express = require('express');
var router = express.Router();
const userController = require('../controller/user-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
let userImg = require('./middle/aws-s3').imageReq('user-profile');
/* GET users listing. */
router.get('/list', adminAuth, userController.getUsers);

router.get('/logout', normalAuth, userController.logout);
router.post('/login', userController.login);

router.post('/', userController.addUser);
router.post('/user-img/:TARGET_USER_ID',
  normalAuth,
  userImg.single('image'),
  userController.uploadUserImg
);
router.delete('/user-img/:TARGET_USER_ID',
  normalAuth,
  userController.deleteUserImg
);
router.get('/:TARGET_USER_ID', normalAuth, userController.getUser);
router.put('/:TARGET_USER_ID', normalAuth, userController.updateUser);
router.delete('/:TARGET_USER_ID', normalAuth, userController.deleteUser);
router.post('/forget', userController.forgetPassword);
router.get('/forget/callback', userController.verifyToken);

module.exports = router;
