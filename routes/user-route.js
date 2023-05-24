var express = require('express');
var router = express.Router();
const userController = require('../controller/user-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
let userImg = require('./middle/aws-s3').imageReq('user-profile');
/* GET users listing. */
router.get('/', adminAuth, userController.getUsers);

router.get('/logout', normalAuth, userController.logout);
router.post('/login', userController.login);

router.post('/', userController.addUser);
router.post('/user-img/:id',
  normalAuth,
  userImg.single('image'),
  userController.uploadUserImg
);
router.delete('/user-img/:id',
  normalAuth,
  userController.deleteUserImg
);
router.get('/:id', normalAuth, userController.getUser);
router.put('/:id', normalAuth, userController.updateUser);
router.delete('/:id', normalAuth, userController.deleteUser);

module.exports = router;
