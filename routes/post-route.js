var express = require('express');
var router = express.Router();
const PostController = require('../controller/post-controller');
const {normalAuth, adminAuth} = require('./middle/jwt');
let PostImg = require('./middle/aws-s3').imageReq('Post-profile');

router.get('/list', PostController.getPosts);
router.post('/', normalAuth, PostImg, PostController.addPost);
router.get('/getPostByUserId/:TARGET_USER_ID', PostController.getPostsByUserId);
router.get('/:POST_ID', PostController.getPostById);
router.put('/:POST_ID', normalAuth, PostImg, PostController.updatePost);
router.delete('/:POST_ID', normalAuth, PostController.deletePost);

module.exports = router;