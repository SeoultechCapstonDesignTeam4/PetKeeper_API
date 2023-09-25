const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('../util/jwt-util');
const {handleErrorResponse} =require('../util/error');

const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_user} = initModels(sequelize);

router.get('/google',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    if(!accesstoken) throw new Error('token not found');
    const {data} = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    // const user ={
    //   USER_EMAIL:data.email,
    //   USER_NAME:data.name,
    //   USER_IMAGE:data.picture,
    //   USER_AUTH_ID:data.sub,
    //   USER_AUTH_PROVIDER: 'google'
    // }

    // const userCheck = await p_user.findOne({where:{USER_AUTH_ID:data.sub}});
    // if(!userCheck){
    //   await p_user.create(user);
    // }

    return res.json(data);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

router.get('/naver',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    if(!accesstoken) throw new Error('token not found');
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    return res.json(response.data);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

router.get('/kakao',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    if(!accesstoken) throw new Error('token not found');
    const response = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    return res.json(response.data);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

module.exports = router;