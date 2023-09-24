const postService = require('../service/post-service');
const {handleErrorResponse,permissionCheck,getCurrentDate} = require('../util/error');
const {  uploadS3Image,deleteS3Image } = require('../util/s3-util');;

const dirName = 'post-photo';

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



async function addPost(req, res) {
  const image = req.file;
  const { USER_ID } = res.locals.userInfo;
  let post = req.body;
  const now = getCurrentDate();
  post.POST_UPLOADED_DATE = now[0];
  post.POST_UPLOADED_TIME = now[1];
  // return res.status(200).json(post).end();
  try {
      if (!post) throw new Error('No post');
      if (image) post.POST_IMAGE = await uploadS3Image(image, dirName, USER_ID);
      
      const data = await postService.addPost(post, USER_ID);
      const photo = {
          POST_ID: data.POST_ID,
          POST_PATH: post.POST_IMAGE,
          PHOTO_UPLOADED_DATE: post.POST_UPLOADED_DATE,
          PHOTO_UPLOADED_TIME: post.POST_UPLOADED_TIME
      };
      await postService.addPostPhoto(photo, USER_ID);
      return res.status(200).json(data).end();
  } catch (err) {
      handleErrorResponse(err, res);
  }
}

async function updatePost(req, res) {
  const image = req.file;
  const { USER_AUTH, USER_ID } = res.locals.userInfo;
  const { POST_ID } = req.params;
  let post = req.body;

  try {
      if (!post) throw new Error('No post');
      const postInfo = await postService.getPostById(POST_ID);
      
      if (permissionCheck(USER_AUTH, USER_ID, postInfo.USER_ID)) {
          if (image) {
              if (postInfo.POST_IMAGE) await deleteS3Image(postInfo.POST_IMAGE);
              post.POST_IMAGE = await uploadS3Image(image, dirName, USER_ID);
          }
          const data = await postService.updatePost(post, POST_ID);
          return res.status(200).json(post).end();
      }
  } catch (err) {
      handleErrorResponse(err, res);
  }
}

async function deletePost(req, res) {
  const { USER_AUTH, USER_ID } = res.locals.userInfo;
  const { POST_ID } = req.params;

  try {
      const postInfo = await postService.getPostById(POST_ID);
      if (permissionCheck(USER_AUTH, USER_ID, postInfo.USER_ID)) {
          if (postInfo.POST_IMAGE) await deleteS3Image(postInfo.POST_IMAGE);
          const data = await postService.deletePost(POST_ID);
          return res.status(200).json(data).end();
      }
  } catch (err) {
      handleErrorResponse(err, res);
  }
}

async function addLike(req,res){
  const {USER_ID} = res.locals.userInfo;
  const {POST_ID} = req.params;
  try{
    const data = await postService.addLike(POST_ID,USER_ID);
    return res.status(200).json(data).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function deleteLike(req,res){
  const {USER_ID} = res.locals.userInfo;
  const {POST_ID} = req.params;
  try{
    const data = await postService.deleteLike(POST_ID,USER_ID);
    return res.status(200).json(data).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function getPostsByLike(req,res){
  const {USER_AUTH,USER_ID} = res.locals.userInfo;
  const {TARGET_USER_ID} = req.params;
  try{
    if(permissionCheck(USER_AUTH,USER_ID,TARGET_USER_ID)){
      const data = await postService.getLikesByUserId(TARGET_USER_ID);
      return res.status(200).json(data).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function addComment(req,res){
  const {USER_ID} = res.locals.userInfo;
  const {POST_ID} = req.params;
  let comment = req.body;
  let now = getCurrentDate();
  comment.COMMENT_UPLOADED_DATE = now[0];
  comment.COMMENT_UPLOADED_TIME = now[1];
  try{
    if(!comment){
      throw new Error('comment not found');
    }
    const data = await postService.addComment(comment,USER_ID,POST_ID);
    return res.status(200).json(data).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function deleteComment(req,res){
  const {USER_AUTH,USER_ID} = res.locals.userInfo;
  const {COMMENT_ID} = req.params;
  try{
    const commentInfo = await postService.getCommentById(COMMENT_ID);
    if(permissionCheck(USER_AUTH,USER_ID,commentInfo.USER_ID)){
      const data = await postService.deleteComment(COMMENT_ID);
      return res.status(200).json(data).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function updateComment(req,res){
  const {USER_AUTH,USER_ID} = res.locals.userInfo;
  const {COMMENT_ID} = req.params;
  let comment = req.body;
  try{
    if(!comment){
      throw new Error('comment not found');
    }
    const commentInfo = await postService.getCommentById(COMMENT_ID);
    if(permissionCheck(USER_AUTH,USER_ID,commentInfo.USER_ID)){
      const data = await postService.updateComment(comment,COMMENT_ID);
      return res.status(200).json(data).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}
async function getPostsByComment(req,res){
  const {USER_AUTH,USER_ID} = res.locals.userInfo;
  const {TARGET_USER_ID} = req.params;
  try{
    if(permissionCheck(USER_AUTH,USER_ID,TARGET_USER_ID)){
      const data = await postService.getCommentsByUserId(USER_ID);
      return res.status(200).json(data).end();
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
  addLike,
  deleteLike,
  getPostsByLike,
  addComment,
  deleteComment,
  updateComment,
  getPostsByComment

}