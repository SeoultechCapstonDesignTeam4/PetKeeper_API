const petService = require('../service/pet-service');
const {uploadImg,deleteImg} = require('../routes/middle/aws-s3');
const sharp = require('sharp');

async function getPet(req,res){
  const userInfo = res.locals.userInfo;
  const {id} = req.params;
  try{
    if(userInfo.USER_AUTH === 'admin' || userInfo.pet_ID === id){
      const data = await petService.getPetById(id);
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
  const userInfo = res.locals.userInfo;
  const {id} = req.params;
  try{
    const pet = await petService.getPetById(id);
    if(userInfo.USER_AUTH ==='admin' || pet.USER_ID === userInfo.USER_ID){
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
  const userInfo = res.locals.userInfo;
  const {id} = req.params;
  const key = 'pet-profile/' + `${id}_${Date.now()}`
  const url = 'https://'+process.env.s3_bucket+'.s3.'+process.env.s3_region+'.amazonaws.com/'+key;
  try{
    if(!image){
      throw new Error('No File');
    }
    const pet = await petService.getPetById(id);
    if(userInfo.USER_AUTH ==='admin' || pet.USER_ID === userInfo.USER_ID){
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
  const userInfo = res.locals.userInfo;
  let {pet} = req.body;
  pet.USER_ID = userInfo.USER_ID;
  try{
    if(!pet){
      throw new Error('No pet');
    }
    const data = await petService.addPet(pet);
    return res.status(200).json(pet).end();;
  }catch(err){
    return res.status(403).json({
      success: false,
      message: err.message
    }).end();
  }
}

async function updatePet(req,res){
  const userInfo = res.locals.userInfo;
  let {pet} = req.body;
  const {id} = req.params;
  try{
    if(!pet){
      throw new Error('No pet');
    }
    const petInfo = await petService.getPetById(id);
    if(userInfo.USER_AUTH === 'admin' || petInfo.USER_ID ===userInfo.USER_ID){
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
  const userInfo = res.locals.userInfo;
  const {id} = req.params;
  try{
    const petInfo = await petService.getPetById(id);
    if(userInfo.USER_AUTH === 'admin' || petInfo.USER_ID ===userInfo.USER_ID){
      const data = await petService.deletePet(id);
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

module.exports ={
  getPet,
  getPets,
  addPet,
  updatePet,
  deletePet,
  uploadPetImg,
  deletePetImg
}