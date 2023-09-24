const postService = require('../service/post-service');
const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');
const sharp = require('sharp');
const {handleErrorResponse,permissionCheck} = require('../util/error');


async function getPosts(req,res){
  try{
    const data = await postService.getPosts()
    return res.status(200).json(data).end();;
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function getPostById(req,res){
  const {POST_ID} = req.params;
  try{
    const data = await postService.getPostById(POST_ID);
    return res.status(200).json(data).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function getPostsByUserId(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {TARGET_USER_ID} = req.params;
  try{
    if(permissionCheck(USER_AUTH,USER_ID,TARGET_USER_ID)){
      const data = await postService.getPostsByUserId(USER_ID);
      return res.status(200).json(data).end();
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function addPost(req,res){
  const image = req.file;
  const {USER_ID} = res.locals.userInfo;
  let post = req.body;
  try{
    if(!post){
      throw new Error('No post');
    }
    if(image){
      const key = 'post-photo/' + `${USER_ID}_${Date.now()}`;
      const url = 'https://' + process.env.s3_bucket + '.s3.' + process.env.s3_region + '.amazonaws.com/' + key;
      const buffer = await sharp(image.buffer).resize({width:640,height:640}).withMetadata().toBuffer();
      await uploadImg(buffer,key,image.mimetype);
      post.POST_IMAGE = url;
    }
    const data = await postService.addPost(post,USER_ID);
    return res.status(200).json(post).end();;
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function updatePost(req,res){
  const image = req.file;
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let post = req.body;
  const {POST_ID} = req.params;
  try{
    if(!post){
      throw new Error('No post');
    }
    const postInfo = await postService.getPostById(POST_ID);
    if(permissionCheck(USER_AUTH,USER_ID,postInfo.USER_ID)){
      if(image){
        if(postInfo.POST_IMAGE !== null){
          const target = postInfo.POST_IMAGE.split('/')[3]+"/"+postInfo.POST_IMAGE.split('/')[4];
          await deleteImg(target);
        }
        const key = 'post-photo/' + `${USER_ID}_${Date.now()}`;
        const url = 'https://' + process.env.s3_bucket + '.s3.' + process.env.s3_region + '.amazonaws.com/' + key;
        const buffer = await sharp(image.buffer).resize({width:640,height:640}).withMetadata().toBuffer();
        await uploadImg(buffer,key,image.mimetype);
        post.POST_IMAGE = url;
      }
      const data = await postService.updatePost(post,POST_ID);
      return res.status(200).json(post).end();
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function deletePost(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {POST_ID} = req.params;
  try{
    const postInfo = await postService.getPostById(POST_ID);
    if(permissionCheck(USER_AUTH,USER_ID,postInfo.USER_ID)){
      if(postInfo.POST_IMAGE !== null){
        const target = postInfo.POST_IMAGE.split('/')[3]+"/"+postInfo.POST_IMAGE.split('/')[4];
        await deleteImg(target);
      }
      const data = await postService.deletePost(POST_ID);
      return res.status(200).json(data).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}


module.exports={
  getPosts,
  getPostById,
  getPostsByUserId,
  addPost,
  updatePost,
  deletePost,

}