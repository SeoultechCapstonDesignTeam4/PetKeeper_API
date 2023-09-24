const petService = require('../service/pet-service');
const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');
const sharp = require('sharp');

async function getPet(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {id} = req.params;
  try{
    const data = await petService.getPetById(id);
    if(USER_AUTH === 'admin' || USER_ID === data.USER_ID){
      return res.status(200).json(data).end();
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}
async function getPets(req,res){
  const data = await petService.getPets()
  return res.status(200).json(data).end();;
}

async function deletePetImg(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {id} = req.params;
  try{
    const pet = await petService.getPetById(id);
    if(USER_AUTH ==='admin' || pet.USER_ID === USER_ID){
      const target = pet.PET_IMAGE.split('/')[3]+"/"+pet.PET_IMAGE.split('/')[4];
      if(target !== 'pet-profile/default-img'){
        await deleteImg(target);
        await petService.deletePetImg(id);
      }
      return res.status(200).json({
        success: true,
        message: 'delete success'
      }).end();
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function uploadPetImg(req,res){
  const image = req.file;
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {id} = req.params;
  const key = 'pet-profile/' + `${id}_${Date.now()}`
  const url = 'https://'+process.env.s3_bucket+'.s3.'+process.env.s3_region+'.amazonaws.com/'+key;
  try{
    if(!image){
      throw new Error('No File');
    }
    const pet = await petService.getPetById(id);
    if(USER_AUTH ==='admin' || pet.USER_ID === USER_ID){
      if(pet.PET_IMAGE !== null){
        const target = pet.PET_IMAGE.split('/')[3]+"/"+pet.PET_IMAGE.split('/')[4];
        await deleteImg(target);
      }
      const buffer = await sharp(image.buffer).resize({width:640,height:640}).withMetadata().toBuffer();
      await uploadImg(buffer,key,image.mimetype);
      await petService.uploadPetImg(id,url);
      return res.status(200).json(url).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function addPet(req,res){
  const {USER_ID} = res.locals.userInfo;
  let pet = req.body;
  try{
    if(!pet){
      throw new Error('No pet');
    }
    const data = await petService.addPet(pet,USER_ID);
    return res.status(200).json(pet).end();;
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function updatePet(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let pet = req.body;
  const {id} = req.params;
  try{
    if(!pet){
      throw new Error('No pet');
    }
    const petInfo = await petService.getPetById(id);
    if(USER_AUTH === 'admin' || petInfo.USER_ID === USER_ID){
      const data = await petService.updatePet(pet,id);
      return res.status(200).json(pet).end();
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}
async function deletePet(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_ID} = req.params;
  try{
    const petInfo = await petService.getPetById(PET_ID);
    if(USER_AUTH === 'admin' || petInfo.USER_ID === USER_ID){
      const data = await petService.deletePet(PET_ID);
      return res.status(200).json(data).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function addPetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let vaccination = req.body;
  const {PET_ID} = req.params;
  try{
    if(!vaccination){
      throw new Error('No vaccination');
    }
    const petInfo = await petService.getPetById(PET_ID);
    if(USER_AUTH === 'admin' || petInfo.USER_ID === USER_ID){
      const data = await petService.addPetVaccination(vaccination,PET_ID);
      return res.status(200).json(vaccination).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}
async function deletePetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_VACCINATION_ID} = req.params;
  try{
    const petInfo = await petService.getPetVaccinationById(PET_VACCINATION_ID);
    const owner_user_Id = petInfo.PET.USER_ID;
    if(USER_AUTH === 'admin' || owner_user_Id === USER_ID){
      const data = await petService.deletePetVaccination(PET_VACCINATION_ID);
      return res.status(200).json(data).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function updatePetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let vaccination = req.body;
  const {PET_VACCINATION_ID} = req.params;
  try{
    if(!vaccination){
      throw new Error('No vaccination');
    }
    const petInfo = await petService.getPetVaccinationById(PET_VACCINATION_ID);
    const owner_user_Id = petInfo.PET.USER_ID;
    if(USER_AUTH === 'admin' || owner_user_Id === USER_ID){
      const data = await petService.updatePetVaccination(vaccination,PET_VACCINATION_ID);
      return res.status(200).json(vaccination).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message,
    }).end();
  }
}

async function addPetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let weight = req.body;
  const {PET_ID} = req.params;
  try{
    if(!weight){
      throw new Error('No weight');
    }
    const petInfo = await petService.getPetById(PET_ID);
    if(USER_AUTH === 'admin' || petInfo.USER_ID === USER_ID){
      const data = await petService.addPetWeight(weight,PET_ID);
      return res.status(200).json(data).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function deletePetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_WEIGHT_ID} = req.params;
  try{
    const weightInfo = await petService.getPetWeightById(PET_WEIGHT_ID);
    const owner_user_Id = weightInfo.PET.USER_ID
    if(USER_AUTH === 'admin' || owner_user_Id === USER_ID){
      const data = await petService.deletePetWeight(PET_WEIGHT_ID);
      return res.status(200).json(data).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function updatePetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  let weight = req.body;
  const {PET_WEIGHT_ID} = req.params;
  try{
    if(!weight){
      throw new Error('No weight');
    }
    const weightInfo = await petService.getPetWeightById(PET_WEIGHT_ID);
    const owner_user_Id = weightInfo.PET.USER_ID
    if(USER_AUTH === 'admin' || owner_user_Id === USER_ID){
      const data = await petService.updatePetWeight(weight,PET_WEIGHT_ID);
      return res.status(200).json(weight).end();;
    }else{
      throw new Error('permission denied');
    }
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message,
    }).end();
  }
}

module.exports ={
  getPet,
  getPets,
  addPet,
  updatePet,
  deletePet,
  uploadPetImg,
  deletePetImg,

  addPetVaccination,
  deletePetVaccination,
  updatePetVaccination,

  addPetWeight,
  deletePetWeight,
  updatePetWeight,
}