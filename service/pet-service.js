const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_pet,p_user} = initModels(sequelize);

async function getPets() {
  const pets = await p_pet.findAll();
  
  if (!pets.length) {
    throw new Error('Pets not found');
  }
  
  return pets;
}

async function deletePetImg(PET_ID) {
  const defaultImg = `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/pet-profile/default-img`;
  
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
  const pet = await p_pet.findOne({ where: { PET_ID: id } });
  
  if (!pet) {
    throw new Error('Pet not found');
  }
  
  return pet;
}

async function getPetByUserId(USER_ID) {
  const pets = await p_pet.findAll({ where: { USER_ID: USER_ID } });
  
  if (!pets.length) {
    throw new Error('Pet not found');
  }
  
  return pets;
}

async function addPet(pet) {
  const createdPet = await p_pet.create(pet);
  
  if (!createdPet) {
    throw new Error('Pet not created');
  }
  
  return createdPet;
}

async function updatePet(pet) {
  const [numOfAffectedRows] = await p_pet.update(
    pet,
    { where: { PET_ID: pet.PET_ID } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not updated');
  }
  
  return numOfAffectedRows;
}

async function deletePet(id) {
  const [numOfAffectedRows] = await p_pet.update(
    { IS_DELETED: true },
    { where: { PET_ID: id } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('Pet not deleted');
  }
  
  return numOfAffectedRows;
}


module.exports ={
  getPets,
  getPetById,
  getPetByUserId,
  addPet,
  updatePet,
  deletePet,
  deletePetImg,
  uploadPetImg
}