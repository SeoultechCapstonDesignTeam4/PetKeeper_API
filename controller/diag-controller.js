const eyeService = require('../service/eye-service');
const petService = require('../service/pet-service');
const axios = require('axios')
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const sharp = require('sharp');
const {uploadImg,deleteImg}= require('../routes/middle/aws-s3');
const {handleErrorResponse, permissionCheck, getCurrentDate} = require('../util/error');
const ec2ip='http://'+process.env.EC2_PUBLIC_IP+':5000';
const eyeurl = `${ec2ip}/predict`;
const petDiagService = require('../service/diag-service');
const p_pet_eye = require('../models/p_pet_eye');

const diagnosisMapping = {
  '정상': 'EYE_NORMAL',
  '백내장': 'EYE_CATARACT',
  '결막염': 'EYE_CONJUNCTIVITIS',
  '색소침착성 각막염': 'EYE_PIGMENTED_KERATITIS',
  '유루증': 'EYE_GALACTORRHEA'
};

async function eye(req,res){
  const image = req.file;
  const imagePath = image.path;
  const { USER_ID,p_pets } = res.locals.userInfo;
  let {PET_ID} = req.params;
  if (!PET_ID){
    PET_ID = p_pets[0].PET_ID;
  }
  const key = 'eye-image/' + `${USER_ID}_${Date.now()}`
  const url = 'https://'+process.env.s3_bucket+'.s3.'+process.env.s3_region+'.amazonaws.com/'+key;
  const form = new FormData();
  const now = getCurrentDate();
  const DIAG = {
    EYE_IMAGE: url,
    EYE_DATE: now[0],
    EYE_TIME: now[1],
    EYE_CONJUNCTIVITIS: 0,
    EYE_PIGMENTED_KERATITIS: 0,
    EYE_GALACTORRHEA: 0,
    EYE_CATARACT: 0,
    EYE_NORMAL: 0,
    EYE_STATE: ""
  }
  try{
    if(!image){ 
      throw new Error('No File');
    }
    form.append('image', fs.createReadStream(image.path));
    const result = await axios.post(eyeurl, form, {
      headers: form.getHeaders()
    });
    fs.unlinkSync(image.path);

    const response = result.data;
    const mappedData = {};
    response.Predicted.forEach((value, index) => {
      mappedData[value] = parseFloat(response.Confidence[index].toFixed(3));
    });
    for (let key in mappedData) {
      if (diagnosisMapping[key]) {
          DIAG[diagnosisMapping[key]] = mappedData[key];
      }
    }
    let maxConfidenceState = Object.keys(mappedData).reduce((a, b) => mappedData[a] > mappedData[b] ? a : b);
    DIAG.EYE_STATE = maxConfidenceState;


    await petDiagService.addPetEyes(USER_ID,PET_ID,DIAG);
    // const filebuffer = fs.readFileSync(image.path);
    // //S3 올리기 전 이미지 전처리
    // if(response.Confidence > 85){
    //   const buffer = await sharp(filebuffer).resize({width:224,height:224}).withMetadata().toBuffer();
    //   await uploadImg(buffer,key,image.mimetype);
    // }
    //파일 삭제
    

    if(response.result == 'Success'){     
      return res.status(200).json({data:mappedData,result:'Success'});  
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