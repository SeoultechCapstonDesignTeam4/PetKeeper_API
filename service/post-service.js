const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_user,p_post,p_post_comment,p_post_like,p_post_photo} = initModels(sequelize);
const { Op } = require('sequelize');

async function getPosts() {
  const posts = await p_post.findAll({
    include: [
      {
        model: p_user,
        as: 'USER',
      },{
        model: p_post_photo,
        as: 'p_post_photos',
      },{
        model: p_post_like,
        as: 'p_post_likes',
      },{
        model: p_post_comment,
        as: 'p_post_comments',
      }
    ]
  });
  if (!posts.length) {
    throw new Error('Posts not found');
  }
  return posts;
}

async function getPostsByUserId(user_id){
  const posts = await p_post.findAll({
    where: {USER_ID: user_id},
    include: [{
        model: p_user,
        as: 'USER',
      },{
        model: p_post_photo,
        as: 'p_post_photos',
      },{
        model: p_post_like,
        as: 'p_post_likes',
      },{
        model: p_post_comment,
        as: 'p_post_comments',
      }
    ]
  });
  return posts;
}

async function getPostById(id) {
  const post = await p_post.findOne({
    where: { POST_ID: id },
    include: [{
      model: p_user,
      as: 'USER',
    },{
      model: p_post_photo,
      as: 'p_post_photos',
    },{
      model: p_post_like,
      as: 'p_post_likes',
    },{
      model: p_post_comment,
      as: 'p_post_comments',
    }
  ]
  });
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  return post;
}

async function addPost(post,user_id) {
  post.USER_ID = user_id;
  const createdPost = await p_post.create(post);
  
  if (!createdPost) {
    throw new Error('Post not created');
  }
  
  return createdPost;
}

async function updatePost(post,id) {
  const check = await p_post.findOne({ where: { POST_ID: id } });
  if (!check) {
    throw new Error('Post not found');
  }
  const [numOfAffectedRows] = await p_post.update(
    post,
    { where: { POST_ID: id } }
  );
  return post
}

async function deletePost(id) {
  const existingPost = await p_post.findOne({
    where: { POST_ID: id },
    include: [{
      model: p_user,
      as: 'USER',
    },{
      model: p_post_photo,
      as: 'p_post_photos',
    },{
      model: p_post_like,
      as: 'p_post_likes',
    },{
      model: p_post_comment,
      as: 'p_post_comments',
    }
  ]
  });
  if (!existingPost) {
    throw new Error('Post not found');
  }

  if (existingPost.p_post_photos.length) {
    await p_post_photo.destroy({ where: { POST_ID: postId } });
  }
  if (existingPost.p_post_likes.length) {
    await p_post_like.destroy({ where: { POST_ID: postId } });
  }
  if (existingPost.p_post_comments.length) {
    await p_post_comment.destroy({ where: { POST_ID: postId } });
  }
  const numOfAffectedRows = await p_post.destroy({
    where: { POST_ID: id },
  });

  return numOfAffectedRows;
}

async function getLikesByPostId(id) {
  const likes = await p_post_like.findAll({
    where: { POST_ID: id },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return likes;
}
async function getLikesByUserId(user_id) {
  const likes = await p_post_like.findAll({
    where: { USER_ID: user_id },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return likes;
}
async function addLike(post_id,user_id){
  const info ={
    POST_ID: post_id,
    USER_ID: user_id,
  }
  const createdLike = await p_post_like.create(info);
  if (!createdLike) {
    throw new Error('Like not created');
  }
  return createdLike;
}

async function deleteLike(post_id,user_id) {
  const existingLike = await p_post_like.findOne({
    where: {
        [Op.and]: [
          { POST_ID: post_id },
          { USER_ID: user_id },
        ]
      }
  });
  if (!existingLike) {
    throw new Error('Like not found');
  }
  const numOfAffectedRows = await p_post_like.destroy({
    where: {
      [Op.and]: [
        { POST_ID: post_id },
        { USER_ID: user_id },
      ]
    },
  });
  return numOfAffectedRows;
}

async function addPostPhoto(photo) {
  const createdPhoto = await p_post_photo.create(photo);
  if (!createdPhoto) {
    throw new Error('Photo not created');
  }
  return createdPhoto;
}

async function getPostPhotosByPostId(id) {
  const photos = await p_post_photo.findAll({
    where: { POST_ID: id },
  });
  return photos;
}

async function updatePostPhoto(photo) {
  const check = await p_post_photo.findOne({ where: { PHOTO_ID: photo.PHOTO_ID } });
  if (!check) {
    throw new Error('Photo not found');
  }
  const [numOfAffectedRows] = await p_post_photo.update(
    photo,
    { where: { PHOTO_ID: photo.PHOTO_ID } }
  );
  return photo
}
async function deletePostPhoto(photo) {
  const existingPhoto = await p_post_photo.findOne({ 
    where: {[Op.and]:[
      { POST_ID: photo.POST_ID },
      { USER_ID: photo.USER_ID },
    ] }
   });
  if (!existingPhoto) {
    throw new Error('Photo not found');
  }
  const numOfAffectedRows = await p_post_photo.destroy({
    where: {[Op.and]:[
      { POST_ID: photo.POST_ID },
      { USER_ID: photo.USER_ID },
    ] }
  });
  return numOfAffectedRows;
}

async function getPostPhotosByUserId(user_id) {
  const photos = await p_post_photo.findAll({
    where: { USER_ID: user_id },
  });
  return photos;
}

async function getCommentsByPostId(id) {
  const comments = await p_post_comment.findAll({
    where: { POST_ID: id },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return comments;
}

async function getCommentsByUserId(user_id) {
  const comments = await p_post_comment.findAll({
    where: { USER_ID: user_id },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return comments;
}

async function addComment(comment) {
  const createdComment = await p_post_comment.create(comment);
  if (!createdComment) {
    throw new Error('Comment not created');
  }
  return createdComment;
}

async function updateComment(comment) {
  const check = await p_post_comment.findOne({ where: { COMMENT_ID: comment.COMMENT_ID } });
  if (!check) {
    throw new Error('Comment not found');
  }
  const [numOfAffectedRows] = await p_post_comment.update(
    comment,
    { where: { COMMENT_ID: comment.COMMENT_ID } }
  );
  return comment
}

async function deleteComment(comment_id) {
  const existingComment = await p_post_comment.findOne({ where: { COMMENT_ID: comment_id } });
  if (!existingComment) {
    throw new Error('Comment not found');
  }
  const numOfAffectedRows = await p_post_comment.destroy({
    where: { COMMENT_ID: comment_id },
  });
  return numOfAffectedRows;
}


module.exports ={
  getPosts,
  getPostById,
  getPostsByUserId,
  addPost,
  updatePost,
  deletePost,

  getLikesByPostId,
  getLikesByUserId,
  addLike,
  deleteLike,

  addPostPhoto,
  getPostPhotosByPostId,
  getPostPhotosByUserId,
  updatePostPhoto,
  deletePostPhoto,

  getCommentsByPostId,
  getCommentsByUserId,
  addComment,
  updateComment,
  deleteComment,

}