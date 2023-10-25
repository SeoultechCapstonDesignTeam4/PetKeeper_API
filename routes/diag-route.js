var express = require('express');
var router = express.Router();
const diagController = require('../controller/diag-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const ec2ip='http://'+process.env.EC2_PUBLIC_IP+':5000';


const uploader = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
      const ext = path.extname(file.originalname);
      cb(null, 'file_' + Date.now() + ext);
    }
  }),
  limits: {fileSize: 3 * 1024 * 1024}
});

// 3.35.40.2

router.get('/', (req, res) => {
  axios.get(`${ec2ip}/`)
  .then(response => {
    return res.status(200).json(response.data);
  })
  .catch(error => {
    return res.status(404).json(error);
  });
});

router.post('/eye/:PET_ID', normalAuth,
  uploader.single('image'),diagController.eye);



module.exports = router;
