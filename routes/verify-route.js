const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('../util/jwt-util');
const { handleErrorResponse, getCurrentDate } = require('../util/error');
const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let { p_user } = initModels(sequelize);

async function afterOauth(result) {
  try{
    const check = await p_user.findOne({where:{USER_OAUTH_ID: result.USER_OAUTH_ID}});
    if(!check){
      await p_user.create(result);
    }
    const token = await jwt.sign(result);
    await p_user.update({USER_ACCESSTOKEN: token},{where:{USER_OAUTH_ID: result.USER_OAUTH_ID}});
    return token;
  }catch(err){
    handleErrorResponse(err,res);
  }
}

async function handleOAuthService(req, res, serviceInfo) {
    // const { accesstoken } = req.headers;
    let accesstoken = req.headers['authorization'];
    accesstoken = accesstoken.split(' ')[1];
    try {
        const now = getCurrentDate();
        if (!accesstoken) throw new Error('token not found');
        
        const { data } = await axios.get(serviceInfo.endpoint, {
            headers: { Authorization: `Bearer ${accesstoken}` }
        });

        const mappedData = serviceInfo.mapData(data);
        mappedData.USER_DATE = now[0];
        mappedData.USER_TIME = now[1];
        console.log(mappedData);
        const token = await afterOauth(mappedData);
        return res.status(200).json({ token: token });
    } catch (err) {
        handleErrorResponse(err, res);
    }
}

const services = {
    google: {
        endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
        mapData: (data) => ({
            USER_OAUTH_ID: data.sub,
            USER_EMAIL: data.email,
            USER_NAME: data.name,
            USER_IMAGE: data.picture,
            USER_OAUTH_PROVIDER: 'google'
        })
    },
    naver: {
        endpoint: 'https://openapi.naver.com/v1/nid/me',
        mapData: (data) => ({
            USER_OAUTH_ID: data.response.id,
            USER_EMAIL: data.response.email,
            USER_NAME: data.response.name,
            USER_IMAGE: data.response.profile_image,
            USER_OAUTH_PROVIDER: 'naver'
        })
    },
    kakao: {
        endpoint: 'https://kapi.kakao.com/v2/user/me',
        mapData: (data) => ({
            USER_OAUTH_ID: data.id,
            USER_EMAIL: data.kakao_account.email,
            USER_NAME: data.properties.nickname,
            USER_IMAGE: data.properties.profile_image,
            USER_OAUTH_PROVIDER: 'kakao'
        })
    }
}

for (let [service, serviceInfo] of Object.entries(services)) {
    router.get(`/${service}`, (req, res) => handleOAuthService(req, res, serviceInfo));
}

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const jwt = require('../util/jwt-util');
// const {handleErrorResponse, getCurrentDate} =require('../util/error');
// const sequelize = require('../models').sequelize;
// let initModels = require('../models/init-models');
// let {p_user} = initModels(sequelize);

// async function afterOauth(result){
//   try{
//     const check = await p_user.findOne({where:{USER_OAUTH_ID: result.USER_OAUTH_ID}});
//     if(!check){
//       await p_user.create(result);
//     }
//     const token = await jwt.sign(result);
//     await p_user.update({USER_ACCESSTOKEN: token},{where:{USER_OAUTH_ID: result.USER_OAUTH_ID}});
//     return token;
//   }catch(err){
//     handleErrorResponse(err,res);
//   }
// }

// router.get('/google',async function(req,res){
//   const {accesstoken} = req.headers;
//   try{
//     const now = getCurrentDate();
//     if(!accesstoken) throw new Error('token not found');
//     const {data} = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//       headers: {Authorization: `Bearer ${accesstoken}`}
//     });
//     const result = {
//       USER_OAUTH_ID: data.sub,
//       USER_EMAIL: data.email,
//       USER_NAME: data.name,
//       USER_IMAGE: data.picture,
//       USER_OAUTH_PROVIDER: 'google',
//       USER_DATE: now[0],
//       USER_TIME: now[1],
//       USER_AUTH: 'normal'
//     }
//     const token = await afterOauth(result);
//     return res.status(200).json({token:token});
//   }catch(err){
//     handleErrorResponse(err,res);
//   }
// });

// router.get('/naver',async function(req,res){
//   const {accesstoken} = req.headers;
//   try{
//     const now = getCurrentDate();
//     if(!accesstoken) throw new Error('token not found');
//     const {data} = await axios.get('https://openapi.naver.com/v1/nid/me', {
//       headers: {Authorization: `Bearer ${accesstoken}`}
//     });
//     const result = {
//       USER_OAUTH_ID: data.response.id,
//       USER_EMAIL: data.response.email,
//       USER_NAME: data.response.name,
//       USER_IMAGE: data.response.profile_image,
//       USER_OAUTH_PROVIDER: 'naver',
//       USER_DATE: now[0],
//       USER_TIME: now[1],
//       USER_AUTH: 'normal'
//     }
//     const token = await afterOauth(result);
//     return res.status(200).json({token:token});
//   }catch(err){
//     handleErrorResponse(err,res);
//   }
// });

// router.get('/kakao',async function(req,res){
//   const {accesstoken} = req.headers;
//   try{
//     const now = getCurrentDate();
//     if(!accesstoken) throw new Error('token not found');
//     const {data} = await axios.get('https://kapi.kakao.com/v2/user/me', {
//       headers: {Authorization: `Bearer ${accesstoken}`}
//     });
//     const result ={
//       USER_OAUTH_ID: data.id,
//       USER_EMAIL: data.kakao_account.email,
//       USER_NAME: data.properties.nickname,
//       USER_IMAGE: data.properties.profile_image,
//       USER_OAUTH_PROVIDER: 'kakao',
//       USER_DATE: now[0],
//       USER_TIME: now[1],
//       USER_AUTH: 'normal'
//     }
//     const token = await afterOauth(result);
//     return res.status(200).json({token:token});
//   }catch(err){
//     handleErrorResponse(err,res);
//   }
// });

// module.exports = router;