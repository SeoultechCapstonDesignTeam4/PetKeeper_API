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

async function getPostsByUserId(USER_ID){
  const posts = await p_post.findAll({
    where: {USER_ID: USER_ID},
    include: [{
        model: p_user,
        as: 'USER',
        attributes: ['USER_NAME','USER_IMAGE']
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

async function getPostById(POST_ID) {
  const post = await p_post.findOne({
    where: { POST_ID: POST_ID },
    include: [{
      model: p_user,
      as: 'USER',
      attributes: ['USER_NAME','USER_IMAGE']
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

async function addPost(post,USER_ID) {
  post.USER_ID = USER_ID;
  const createdPost = await p_post.create(post);
  
  if (!createdPost) {
    throw new Error('Post not created');
  }
  
  return createdPost;
}

async function updatePost(post,POST_ID) {
  const check = await p_post.findOne({ where: { POST_ID: POST_ID } });
  if (!check) {
    throw new Error('Post not found');
  }
  const [numOfAffectedRows] = await p_post.update(
    post,
    { where: { POST_ID: POST_ID } }
  );
  return post
}

async function deletePost(POST_ID) {
  const t = await sequelize.transaction();
  try {
    const existingPost = await p_post.findOne({
      where: { POST_ID: POST_ID },
      include: [
        { model: p_user, as: 'USER' },
        { model: p_post_photo, as: 'p_post_photos' },
        { model: p_post_like, as: 'p_post_likes' },
        { model: p_post_comment, as: 'p_post_comments' }
      ]
    }, { transaction: t });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.p_post_photos.length) {
      await p_post_photo.destroy({ where: { POST_ID: POST_ID } }, { transaction: t });
    }
    if (existingPost.p_post_likes.length) {
      await p_post_like.destroy({ where: { POST_ID: POST_ID } }, { transaction: t });
    }

    const numOfAffectedRows = await p_post.destroy({
      where: { POST_ID: POST_ID },
    }, { transaction: t });

    await t.commit();

    return numOfAffectedRows;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function getLikesByPostId(POST_ID) {
  const likes = await p_post_like.findAll({
    where: { POST_ID: POST_ID },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return likes;
}
async function getLikesByUserId(USER_ID) {
  const likes = await p_post_like.findAll({
    where: { USER_ID: USER_ID },
    include:{
      model: p_post,
      as: 'POST'
    }
  });
  return likes;
}
async function addLike(POST_ID,USER_ID){
  const info ={
    POST_ID: POST_ID,
    USER_ID: USER_ID,
  }
  const createdLike = await p_post_like.create(info);
  if (!createdLike) {
    throw new Error('Like not created');
  }
  return createdLike;
}

async function deleteLike(POST_ID,USER_ID) {
  const existingLike = await p_post_like.findOne({
    where: {
        [Op.and]: [
          { POST_ID: POST_ID },
          { USER_ID: USER_ID },
        ]
      }
  });
  if (!existingLike) {
    throw new Error('Like not found');
  }
  const numOfAffectedRows = await p_post_like.destroy({
    where: {
      [Op.and]: [
        { POST_ID: POST_ID },
        { USER_ID: USER_ID },
      ]
    },
  });
  return numOfAffectedRows;
}

async function addPostPhoto(photo,USER_ID) {
  photo.USER_ID = USER_ID;
  const createdPhoto = await p_post_photo.create(photo);
  if (!createdPhoto) {
    throw new Error('Photo not created');
  }
  return createdPhoto;
}

async function getPostPhotosByPostId(POST_ID) {
  const photos = await p_post_photo.findAll({
    where: { POST_ID: POST_ID },
  });
  return photos;
}

async function updatePostPhoto(photo,PHOTO_ID) {
  const check = await p_post_photo.findOne({ where: { PHOTO_ID: PHOTO_ID } });
  if (!check) {
    throw new Error('Photo not found');
  }
  const [numOfAffectedRows] = await p_post_photo.update(
    photo,
    { where: { PHOTO_ID: PHOTO_ID } }
  );
  return photo
}
async function deletePostPhoto(POST_ID) {
  const existingPhoto = await p_post_photo.findOne({ where: { POST_ID: POST_ID } });
  if (!existingPhoto) {
    throw new Error('Photo not found');
  }
  const numOfAffectedRows = await p_post_photo.destroy({
    where: { POST_ID: POST_ID },
  });
  return numOfAffectedRows;
}

async function getPostPhotosByUserId(USER_ID) {
  const photos = await p_post_photo.findAll({
    where: { USER_ID: USER_ID },
  });
  return photos;
}

async function getCommentsByPostId(POST_ID) {
  const comments = await p_post_comment.findAll({
    where: { POST_ID: POST_ID },
    include:{
      model: p_user,
      as: 'USER',
    }
  });
  return comments;
}

//내가 댓글 쓴 게시물들 검색
async function getCommentsByUserId(USER_ID) {
  const comments = await p_post_comment.findAll({
    where: { USER_ID: USER_ID },
    include:[
      {
        model: p_user,
        as: 'USER',
        attributes: ['USER_NAME','USER_IMAGE']
      },{
        model: p_post,
        as: 'POST',
      }
    ]
  });
  return comments;
}

async function getCommentById(COMMENT_ID) {
  const comment = await p_post_comment.findOne({
    where: { COMMENT_ID: COMMENT_ID },
    include:{
      model: p_user,
      as: 'USER',
      attributes: ['USER_NAME','USER_IMAGE'] 
    }
  });
  if (!comment) {
    throw new Error('Comment not found');
  }
  return comment;
}

async function addComment(comment,USER_ID,POST_ID) {
  comment.POST_ID = POST_ID;
  comment.USER_ID = USER_ID;
  const createdComment = await p_post_comment.create(comment);
  if (!createdComment) {
    throw new Error('Comment not created');
  }
  return createdComment;
}

async function updateComment(comment,COMMENT_ID) {
  const check = await p_post_comment.findOne({ where: { COMMENT_ID: COMMENT_ID } });
  if (!check) {
    throw new Error('Comment not found');
  }
  const [numOfAffectedRows] = await p_post_comment.update(
    comment,
    { where: { COMMENT_ID: COMMENT_ID } }
  );
  return comment
}

async function deleteComment(COMMENT_ID) {
  const existingComment = await p_post_comment.findOne({ where: { COMMENT_ID: COMMENT_ID } });
  if (!existingComment) {
    throw new Error('Comment not found');
  }
  const numOfAffectedRows = await p_post_comment.destroy({
    where: { COMMENT_ID: COMMENT_ID },
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
  getCommentById,
  addComment,
  updateComment,
  deleteComment,

}