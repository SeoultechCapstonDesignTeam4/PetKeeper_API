const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_user,p_post} = initModels(sequelize);
const { Op } = require('sequelize');

async function getPosts() {
  const posts = await p_post.findAll({
    include: {
      model: p_user,
      as: 'USER',
    }
  });
  if (!posts.length) {
    throw new Error('Posts not found');
  }
  return posts;
}

async function getPostsByUserId(user_id){
  const posts = await p_post.findAll({
    where: {USER_ID: user_id},
  });
  return posts;
}

async function getPostById(id) {
  const post = await p_post.findOne({
    where: { POST_ID: id },
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
  const existingPost = await p_post.findOne({ where: { POST_ID: id } });
  if (!existingPost) {
    throw new Error('Post not found');
  }
  const numOfAffectedRows = await p_post.destroy({
    where: { POST_ID: id },
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
  // uploadPostImg,
  // deletePostImg,
}