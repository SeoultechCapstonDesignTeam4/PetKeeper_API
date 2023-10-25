const sequelize = require('../models').sequelize;
const initModels = require('../models/init-models');
const {p_pet_eye,p_pet,p_user} = initModels(sequelize);
const Op = require('sequelize').Op;
async function addPetEyes(USER_ID,PET_ID,DIAG){
  DIAG.USER_ID = USER_ID;
  DIAG.PET_ID = PET_ID;
  const check = await p_pet.findOne({where: {PET_ID: PET_ID}});
  if(check.USER_ID != USER_ID){
    throw new Error('Permission denied');
  }
  // const check2 = await p_pet_eye.findOne(
  //   {
  //     where: {PET_ID: PET_ID}
  //   }
  // );
  // if(check2){
  //   throw new Error('Already exist')
  // }
  const data = await p_pet_eye.create(DIAG);
  return data
}

async function getPetEyesByPetId(PET_ID){
  const data = await p_pet_eye.findAll({
    where: {PET_ID: PET_ID},
    order: [['EYE_DATE','DESC'],['EYE_TIME','DESC']]
  });
}

async function getPetEyesByUserId(USER_ID){
  const data = await p_pet_eye.findAll({
    where: {USER_ID: USER_ID},
    order: [['EYE_DATE','DESC'],['EYE_TIME','DESC']]
  });
}

async function deletePetEyes(EYE_ID){
  const data = await p_pet_eye.destroy({where: {EYE_ID: EYE_ID}});
  return data;
}

module.exports = {
  addPetEyes,
  getPetEyesByPetId,
  getPetEyesByUserId
}