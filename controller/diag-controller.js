const eyeService = require('../service/eye-service');
const petService = require('../service/pet-service');
const axios = require('axios')
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const sharp = require('sharp');
const {uploadImg,deleteImg}= require('../routes/middle/aws-s3');
const {handleErrorResponse, permissionCheck} = require('../util/error');
const ec2ip='http://'+process.env.EC2_PUBLIC_IP+':5000';
const eyeurl = `${ec2ip}/predict`;

async function eye(req,res){
  const image = req.file;
  const id = res.locals.userInfo.USER_ID
  const key = 'eye-image/' + `${id}_${Date.now()}`
  const url = 'https://'+process.env.s3_bucket+'.s3.'+process.env.s3_region+'.amazonaws.com/'+key;
  const form = new FormData();
  try{
    if(!image){ 
      throw new Error('No File');
    }
    form.append('image', fs.createReadStream(image.path));
    const result = await axios.post(eyeurl, form, {
      headers: form.getHeaders()
    });
    const response = result.data;

    const filebuffer = fs.readFileSync(image.path);
    //S3 올리기 전 이미지 전처리
    if(response.Confidence > 85){
      const buffer = await sharp(filebuffer).resize({width:224,height:224}).withMetadata().toBuffer();
      await uploadImg(buffer,key,image.mimetype);
    }
    //파일 삭제
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    } else {
      throw new Error('No File');
    }
    if(response.result == 'Success'){
      return res.status(200).json(response);  
    }else{
      return res.status(403).json(response);
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

module.exports ={
  eye
}