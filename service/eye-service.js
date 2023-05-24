const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_pet,p_user,p_eye} = initModels(sequelize);

async function getEyes(){
  try{
    const data = await p_eye.findAll();
    return data;
  }catch(err){
    console.log(err);
  }
}

async function getEyeByConj(pet_id,CONJUNCTIVITIS){
  try{
    const data = await p_eye.findOne(
      {where:
        {
        EYE_CONJUNCTIVITIS:CONJUNCTIVITIS, PET_ID:pet_id
        }
    });
    return data;
  }catch(err){
    console.log(err);
  }
}

async function deleteEyeImg(EYE_ID){
  const defaultImg = 'https://'+process.env.s3_bucket+'.s3.'+process.env.s3_region+'.amazonaws.com/eye-profile/default-img';
  try{
    const data = await p_eye.update({eye_IMAGE: defaultImg},{where: {EYE_ID: EYE_ID}});
    return data;
  }catch(err){
    throw err;
  }
}



async function uploadEyeImg(EYE_ID,key){
  try{
    const data = await p_eye.update({EYE_IMAGE: key},{where: {EYE_ID: EYE_ID}});
    return data;
  }catch(err){
    throw err;
  }
}

async function getEyeById(id){
  try{
    const data = await p_eye.findOne({where: {EYE_ID: id}});
    return data;
  }catch(err){
    console.log(err);
  }
}

async function getEyeByUserId(UEYE_ID){
  try{
    const data = await p_eye.findAll({where: {USER_ID: USER_ID}});
    return data;
  }catch(err){
    console.log(err);
  }
}

async function addEye(eye){
  try{
    const data = await p_eye.create(eye);
    return data;
  }catch(err){
    console.log(err);
  }
}

async function updateEye(eye){
  try{
    const data = await p_eye.update(eye,{where: {EYE_ID: eye.EYE_ID}});
    return data;
  }catch(err){
    console.log(err);
  }
}

async function deleteEye(id){
  try{
    const data = await p_eye.destroy({
      where: {EYE_ID: id}
    });
    return data;
  }catch(err){
    console.log(err);
  }
}


module.exports ={
  getEyes,
  getEyeById,
  getEyeByUserId,
  addEye,
  updateEye,
  deleteEye,
  deleteEyeImg,
  uploadEyeImg,
  getEyeByConj
}