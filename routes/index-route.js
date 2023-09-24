var express = require('express');
var router = express.Router();
const indexController = require('../controller/index-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
router.get('/',normalAuth,indexController.index);
router.get('/hospital',indexController.getHostpital);
// router.get('/hospitalUpdate',adminAuth,indexController.updateHostpital);

module.exports = router;
