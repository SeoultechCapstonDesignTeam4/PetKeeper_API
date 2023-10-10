const petService = require('../service/pet-service');
const {uploadS3Img,deleteS3Img, uploadS3Image, deleteS3Image} = require('../util/s3-util');
const {permissionCheck,handleErrorResponse, getCurrentDate} = require('../util/error');
const { formatDateFromAndroid } = require('../util/date_phone');
const dirName = 'pet-profile';
const userService = require('../service/user-service');

async function getPet(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_ID} = req.params;
  try{
    const pet = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,pet.USER_ID)){
      return res.status(200).json(pet).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}
async function getPets(req,res){
  try{
    const data = await petService.getPets()
    return res.status(200).json(data).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function deletePetImg(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_ID} = req.params;
  try{
    const pet = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,pet.USER_ID)){
      const target = pet.PET_IMAGE.split('/')[3]+"/"+pet.PET_IMAGE.split('/')[4];
      if(target !== `${dirName}/default-img`){
        await deleteS3Image(pet.PET_IMAGE);
        await petService.deletePetImg(PET_ID);
      }
      return res.status(200).json({
        success: true,
        message: 'delete success'
      }).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function uploadPetImg(req,res){
  const image = req.file;
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_ID} = req.params;
  
  try{
    if(!image){
      throw new Error('No File');
    }
    const pet = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,pet.USER_ID)){
      const target = pet.PET_IMAGE.split('/')[3]+"/"+pet.PET_IMAGE.split('/')[4];
      if(target !== `${dirName}/default-img`){
        await deleteS3Image(pet.PET_IMAGE);
      }
      await uploadS3Image(image,dirName,USER_ID);
      await petService.uploadPetImg(PET_ID,url);
      return res.status(200).json(url).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function addPet(req,res){
  const image = req.file;
  const {USER_ID,USER_ACCESSTOKEN} = res.locals.userInfo;
  const {PET_NAME, PET_KIND, PET_GENDER, PET_BIRDHDATE} = req.body;
  
  const pet = {
    PET_NAME: PET_NAME?PET_NAME:null,
    PET_KIND: PET_KIND?PET_KIND:null,
    PET_GENDER: PET_GENDER?PET_GENDER:null,
    PET_BIRDHDATE: PET_BIRDHDATE?formatDateFromAndroid(PET_BIRDHDATE):null,
  }
  const now = getCurrentDate();
  pet.PET_DATE = now[0];
  pet.PET_TIME = now[1];
  try{
    if(!pet){
      throw new Error('No pet');
    }
    if (image) pet.PET_IMAGE = await uploadS3Image(image, dirName, USER_ID);
    const addedPet = await petService.addPet(pet,USER_ID);
    const userInformation = await userService.getUserById(USER_ID);
    return res.status(200).json({
      token:USER_ACCESSTOKEN,
      USER:userInformation
    }).end();
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function updatePet(req,res){
  const {USER_AUTH, USER_ID,USER_ACCESSTOKEN} = res.locals.userInfo;
  let pet = req.body;
  const {PET_ID} = req.params;
  try{
    if(!pet){
      throw new Error('No pet');
    }
    const petInfo = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,petInfo.USER_ID)){
      await petService.updatePet(pet,PET_ID);
      const userInformation = await userService.getUserById(USER_ID);
      return res.status(200).json({
        token:USER_ACCESSTOKEN,
        USER:userInformation
      }).end();
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}
async function deletePet(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_ID} = req.params;
  try{
    const petInfo = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,petInfo.USER_ID)){
      const data = await petService.deletePet(PET_ID);
      return res.status(200).json(data).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function addPetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;

  const {PET_VACCINATION_NAME, PET_VACCINATION_DATE, PET_VACCINATION_PERIOD} = req.body;
  const vaccination = {
    PET_VACCINATION_DATE: PET_VACCINATION_DATE?formatDateFromAndroid(PET_VACCINATION_DATE):null,
    PET_VACCINATION_PERIOD: PET_VACCINATION_PERIOD?PET_VACCINATION_PERIOD:null,
    PET_VACCINATION_NAME: PET_VACCINATION_NAME?PET_VACCINATION_NAME:null,
  }

  const {PET_ID} = req.params;
  const now = getCurrentDate();
  vaccination.VACCINATION_DATE = now[0];
  vaccination.VACCINATION_TIME = now[1];
  try{
    if(!vaccination){
      throw new Error('No vaccination');
    }
    const petInfo = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,petInfo.USER_ID)){
      const data = await petService.addPetVaccination(vaccination,PET_ID);
      return res.status(200).json(vaccination).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}
async function deletePetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_VACCINATION_ID} = req.params;
  try{
    const petInfo = await petService.getPetVaccinationById(PET_VACCINATION_ID);
    const owner_user_Id = petInfo.PET.USER_ID;
    if(permissionCheck(USER_AUTH,USER_ID,owner_user_Id)){
      const data = await petService.deletePetVaccination(PET_VACCINATION_ID);
      return res.status(200).json(data).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function updatePetVaccination(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_VACCINATION_NAME, PET_VACCINATION_DATE, PET_VACCINATION_PERIOD} = req.body;
  const vaccination = {
    PET_VACCINATION_DATE: PET_VACCINATION_DATE?formatDateFromAndroid(PET_VACCINATION_DATE):null,
    PET_VACCINATION_PERIOD: PET_VACCINATION_PERIOD?PET_VACCINATION_PERIOD:null,
    PET_VACCINATION_NAME: PET_VACCINATION_NAME?PET_VACCINATION_NAME:null,
  }
  const {PET_VACCINATION_ID} = req.params;
  try{
    if(!vaccination){
      throw new Error('No vaccination');
    }
    const petInfo = await petService.getPetVaccinationById(PET_VACCINATION_ID);
    const owner_user_Id = petInfo.PET.USER_ID;
    if(permissionCheck(USER_AUTH,USER_ID,owner_user_Id)){
      const data = await petService.updatePetVaccination(vaccination,PET_VACCINATION_ID);
      return res.status(200).json(vaccination).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function addPetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_WEIGHT,PET_WEIGHT_DATE} = req.body;
  const weight = {
    PET_WEIGHT: PET_WEIGHT?PET_WEIGHT:null,
    PET_WEIGHT_DATE: PET_WEIGHT_DATE?formatDateFromAndroid(PET_WEIGHT_DATE):null,
  }
  console.log(weight);
  const {PET_ID} = req.params;
  try{
    
    if(!PET_WEIGHT || !PET_WEIGHT_DATE){
      throw new Error('No weight or weight date');
    }
    const petInfo = await petService.getPetById(PET_ID);
    if(permissionCheck(USER_AUTH,USER_ID,petInfo.USER_ID)){
      const data = await petService.addPetWeight(weight,PET_ID);
      return res.status(200).json(data).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function deletePetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_WEIGHT_ID} = req.params;
  try{
    const weightInfo = await petService.getPetWeightById(PET_WEIGHT_ID);
    const owner_user_Id = weightInfo.PET.USER_ID
    if(permissionCheck(USER_AUTH,USER_ID,owner_user_Id)){
      const data = await petService.deletePetWeight(PET_WEIGHT_ID);
      return res.status(200).json(data).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
  }
}

async function updatePetWeight(req,res){
  const {USER_AUTH, USER_ID} = res.locals.userInfo;
  const {PET_WEIGHT,PET_WEIGHT_DATE} = req.body;
  const weight = {
    PET_WEIGHT: PET_WEIGHT?PET_WEIGHT:null,
    PET_WEIGHT_DATE: PET_WEIGHT_DATE?formatDateFromAndroid(PET_WEIGHT_DATE):null,
  }
  const {PET_WEIGHT_ID} = req.params;
  try{
    if(!weight){
      throw new Error('No weight');
    }
    const weightInfo = await petService.getPetWeightById(PET_WEIGHT_ID);
    const owner_user_Id = weightInfo.PET.USER_ID
    if(permissionCheck(USER_AUTH,USER_ID,owner_user_Id)){
      const data = await petService.updatePetWeight(weight,PET_WEIGHT_ID);
      return res.status(200).json(weight).end();;
    }
  }catch(err){
    handleErrorResponse(err, res);
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