var express = require('express');
var router = express.Router();
const indexController = require('../controller/index-controller');

const {normalAuth, adminAuth} = require('./middle/jwt');
// let p_user = require('../models').p_user;

/* GET home page. */
router.get('/',normalAuth,indexController.index);

router.get('/apiTest',indexController.getTest);
router.post('/apiTest',indexController.postTest);

module.exports = router;
