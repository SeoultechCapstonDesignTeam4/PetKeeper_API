const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('../util/jwt-util');
const {handleErrorResponse, getCurrentDate} =require('../util/error');
const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_user} = initModels(sequelize);

router.get('/google',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    const now = getCurrentDate();
    if(!accesstoken) throw new Error('token not found');
    const {data} = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    const result = {
      USER_OAUTH_ID: data.sub,
      USER_EMAIL: data.email,
      USER_NAME: data.name,
      USER_IMAGE: data.picture,
      USER_OAUTH_PROVIDED: 'google',
      USER_DATE: now[0],
      USER_TIME: now[1],
    }
    return res.json(result);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

router.get('/naver',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    const now = getCurrentDate();
    if(!accesstoken) throw new Error('token not found');
    const {data} = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    const result = {
      USER_OAUTH_ID: data.response.id,
      USER_EMAIL: data.response.email,
      USER_NAME: data.response.name,
      USER_IMAGE: data.response.profile_image,
      USER_OAUTH_PROVIDED: 'naver',
      USER_DATE: now[0],
      USER_TIME: now[1],
    }
    return res.json(result);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

router.get('/kakao',async function(req,res){
  const {accesstoken} = req.headers;
  try{
    const now = getCurrentDate();
    if(!accesstoken) throw new Error('token not found');
    const {data} = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {Authorization: `Bearer ${accesstoken}`}
    });
    const result ={
      USER_OAUTH_ID: data.id,
      USER_EMAIL: data.kakao_account.email,
      USER_NAME: data.properties.nickname,
      USER_IMAGE: data.properties.profile_image,
      USER_OAUTH_PROVIDED: 'kakao',
      USER_DATE: now[0],
      USER_TIME: now[1],
    }
    return res.json(result);
  }catch(err){
    handleErrorResponse(err,res);
  }
});

module.exports = router;