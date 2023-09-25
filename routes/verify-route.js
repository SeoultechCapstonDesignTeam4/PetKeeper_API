const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/google',async function(req,res){
  const {accessToken} = req.body;
  const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {Authorization: `Bearer ${accessToken}`}
  });
  return res.json(response.data);
});

router.post('/naver',async function(req,res){
  const {accessToken} = req.body;
  const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: {Authorization: `Bearer ${accessToken}`}
  });
  return res.json(response.data);
});

router.post('/kakao',async function(req,res){
  const {accessToken} = req.body;
  const response = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
    headers: {Authorization: `Bearer ${accessToken}`}
  });
  return res.json(response.data);
});


module.exports = router;