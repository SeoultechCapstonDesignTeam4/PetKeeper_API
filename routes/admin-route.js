var express = require('express');
var router = express.Router();
const indexController = require('../controller/index-controller');
const adminController = require('../controller/admin-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
router.get('/',normalAuth,indexController.index);

router.get('/login', (req, res) => {
  res.render('login');
});
// router.get('/user/list',adminAuth,adminController.userList);
router.get('/user/list',adminController.userList);

module.exports = router;
