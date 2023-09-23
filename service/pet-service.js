const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_pet,p_user,p_pet_vaccination,p_pet_weight} = initModels(sequelize);
const { Op } = require('sequelize');

async function getPets() {
  const pets = await p_pet.findAll({
    include: [
      {
        model: p_pet_vaccination,
        as: 'p_pet_vaccinations',
      },{
        model: p_pet_weight,
        as: 'p_pet_weights',
      }
    ]
  });
  
  if (!pets.length) {
    throw new Error('Pets not found');
  }
  
  return pets;
}

async function deletePetImg(PET_ID) {
  const defaultImg = `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/pet-profile/default-img`;
  const check = await p_pet.findOne({ where: { PET_ID: PET_ID } });
  if (!check) {
    throw new Error('Pet not found');
  }
  const [numOfAffectedRows] = await p_pet.update(
    { PET_IMAGE: defaultImg },
    { where: { PET_ID: PET_ID } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not found');
  }
  
  return numOfAffectedRows;
}

async function uploadPetImg(PET_ID, key) {
  const check = await p_pet.findOne({ where: { PET_ID: PET_ID } });
  if (!check) {
    throw new Error('Pet not found');
  }

  const [numOfAffectedRows] = await p_pet.update(
    { PET_IMAGE: key },
    { where: { PET_ID: PET_ID } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not found');
  }
  
  return numOfAffectedRows;
}

async function getPetById(id) {
  const pet = await p_pet.findOne({ 
    include: [
    {
        model: p_pet_vaccination,
        as: 'p_pet_vaccinations',
      },{
        model: p_pet_weight,
        as: 'p_pet_weights',
      }
    ],where: { PET_ID: id } });
  
  if (!pet) {
    throw new Error('Pet not found');
  }
  return pet;
}

async function getPetByUserId(USER_ID) {
  const pets = await p_pet.findAll({ 
    include: [
      {
        model: p_pet_vaccination,
        as: 'p_pet_vaccinations',
      },{
        model: p_pet_weight,
        as: 'p_pet_weights',
      }
    ],where: { USER_ID: USER_ID } });
  
  if (!pets.length) {
    throw new Error('Pet not found');
  }
  
  return pets;
}

async function addPet(pet,user_id) {
  pet.USER_ID = user_id;
  const createdPet = await p_pet.create(pet);
  if (!createdPet) {
    throw new Error('Pet not created');
  }
  
  return createdPet;
}

async function updatePet(pet,id) {
  const check = await p_pet.findOne({ where: { PET_ID: id } });
  if (!check) {
    throw new Error('Pet not found');
  }

  const [numOfAffectedRows] = await p_pet.update(
    pet,
    { where: { PET_ID: id } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not updated');
  }
  return pet;
}

async function deletePet(id) {
  // const [numOfAffectedRows] = await p_pet.update(
  //   { IS_DELETED: true },
  //   { where: { PET_ID: id } }
  // );
  const check = await p_pet.findOne({ where: { PET_ID: id } });
  if (!check) {
    throw new Error('Pet not found');
  }

  const numOfAffectedRows = await p_pet.destroy({ where: { PET_ID: id } });
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not deleted');
  }
  
  return numOfAffectedRows;
}

async function getPetVaccinations(id){
  const petValidate = await p_pet.findOne({ where: { PET_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const petVaccination = await p_pet_vaccination.findAll({ where: { PET_ID: id } });
  if (!petVaccination) {
    throw new Error('Pet_Vaccination not found');
  }
  return petVaccination;
}
async function getPetVaccinationByDate(id,date){
  const petValidate = await p_pet.findOne({ where: { PET_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const petVaccination = await p_pet_vaccination.findAll({
    where: {
      [Op.and]: [
        {PET_VACCINATION_DATE: date},
        {PET_ID: id}
      ]
    }
  });
  if (!petVaccination) {
    throw new Error('Pet_Vaccination not found');
  }
  return petVaccination;
}
async function getPetVaccinationById(vaccination_id){
  const petVaccination = await p_pet_vaccination.findOne({
    include:
      {
        model: p_pet,
        as: 'PET',
      }
    ,where: { PET_VACCINATION_ID: vaccination_id }
  });
  if (!petVaccination) {
    throw new Error('Pet_Vaccination not found');
  }
  return petVaccination;
}
async function addPetVaccination(vaccination,pet_id){
  vaccination.PET_ID = pet_id;
  const createdVaccination = await p_pet_vaccination.create(vaccination);
  if (!createdVaccination) {
    throw new Error('Pet_Vaccination not created');
  }
  return createdVaccination;
}

async function updatePetVaccination(vaccination,vaccination_id){
  const petValidate = await p_pet_vaccination.findOne({ where: { PET_VACCINATION_ID: vaccination_id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const updatedVaccination = await p_pet_vaccination.update(vaccination, { where: { PET_VACCINATION_ID: vaccination_id } });
  if (!updatedVaccination) {
    throw new Error('Pet_Vaccination not updated');
  }
  return vaccination;
}

async function deletePetVaccination(vaccination_id){
  const petValidate = await p_pet_vaccination.findOne({ where: { PET_VACCINATION_ID: vaccination_id } });
  if (!petValidate) {
    throw new Error('Pet_Vaccination not found');
  }
  const deletedVaccination = await p_pet_vaccination.destroy({ where: { PET_VACCINATION_ID: vaccination_id } });
  if (!deletedVaccination) {
    throw new Error('Pet_Vaccination not deleted');
  }
  return deletedVaccination;
}

async function getPetWeights(id){
  const petValidate = await p_pet.findOne({ where: { PET_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const petWeight = await p_pet_weight.findAll({ where: { PET_ID: id } });
  if (!petWeight) {
    throw new Error('Pet_WEIGHT not found');
  }
  return petWeight;
}

async function getPetWeightByDate(id,date){
  const petValidate = await p_pet.findOne({ where: { PET_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const petWeight = await p_pet_weight.findAll({
    where: {
      [Op.and]: [
        {PET_WEIGHT_DATE: date},
        {PET_ID: id}
      ]
    }
  });
  if (!petWeight) {
    throw new Error('Pet_WEIGHT not found');
  }
  return petWeight;
}

async function getPetWeightById(weight_id){
  const petWeight = await p_pet_weight.findOne({
    include:
      {
        model: p_pet,
        as: 'PET'
      }
    ,where: { PET_WEIGHT_ID: weight_id }
  });
  if (!petWeight) {
    throw new Error('Pet_WEIGHT not found');
  }
  return petWeight;
}

async function addPetWeight(info,id){
  info.PET_ID = id;
  const createdWeight = await p_pet_weight.create(info);
  if (!createdWeight) {
    throw new Error('Pet_WEIGHT not created');
  }
  return createdWeight;
}
async function updatePetWeight(info,id){
  const petValidate = await p_pet_weight.findOne({ where: { PET_WEIGHT_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const updatedWeight = await p_pet_weight.update(info, { where: { PET_WEIGHT_ID: id } });
  if (!updatedWeight) {
    throw new Error('Pet_WEIGHT not updated');
  }
  return info;
}

async function deletePetWeight(id){
  const petValidate = await p_pet_weight.findOne({ where: { PET_WEIGHT_ID: id } });
  if (!petValidate) {
    throw new Error('Pet not found');
  }
  const deletedWeight = await p_pet_weight.destroy({ where: { PET_WEIGHT_ID: id } });
  if (!deletedWeight) {
    throw new Error('Pet_WEIGHT not deleted');
  }
  return deletedWeight;
}


module.exports ={
  getPets,
  getPetById,
  getPetByUserId,
  addPet,
  updatePet,
  deletePet,
  deletePetImg,
  uploadPetImg,

  getPetVaccinations,
  getPetVaccinationByDate,
  getPetVaccinationById,
  addPetVaccination,
  updatePetVaccination,
  deletePetVaccination,

  getPetWeights,
  getPetWeightByDate,
  getPetWeightById,
  addPetWeight,
  updatePetWeight,
  deletePetWeight
}