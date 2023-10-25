const sequelize = require('../models').sequelize;
let initModels = require('../models/init-models');
let {p_pet,p_user,p_pet_vaccination,p_pet_weight,p_pet_eye} = initModels(sequelize);
const { Op } = require('sequelize');
async function getUsers() {
  const users = await p_user.findAll({
    attributes: {
      exclude: ['USER_PASSWORD', 'USER_ACCESSTOKEN', 'IS_DELETED', 'createdAt', 'updatedAt']
    },
    include: {
      model: p_pet,
      as: 'p_pets',
      where: { IS_DELETED: 0 },
      required: false,
      include:[
        {
          model: p_pet_vaccination,
          as: 'p_pet_vaccinations',
          attributes: { exclude: ['PET_ID'] },
        },{
          model: p_pet_weight,
          as: 'p_pet_weights',
          attributes: { exclude: ['PET_ID'] },
        },
        {
          model: p_pet_eye,
          as: 'p_pet_eyes',
          attributes: { exclude: ['PET_ID','USER_ID'] },
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'IS_DELETED'] }
    }
  });
  
  if (!users.length) {
    throw new Error('Users not found');
  }
  
  return users;
}

async function deleteUserImg(USER_ID) {
  const defaultImg = `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/user-profile/default-img`;
  const check = await p_user.findOne({ where: { USER_ID: USER_ID } });
  if (!check) {
    throw new Error('User not found');
  }
  const [numOfAffectedRows] = await p_user.update(
    { USER_IMAGE: defaultImg },
    { where: { USER_ID: USER_ID } }
  );
  
  // if (numOfAffectedRows === 0) {
  //   throw new Error('User Image Not Deleted');
  // }
  
  return defaultImg;
}

async function uploadUserImg(USER_ID, key) {
  const [numOfAffectedRows] = await p_user.update(
    { USER_IMAGE: key },
    { where: { USER_ID: USER_ID } }
  );
  
  if (numOfAffectedRows === 0) {
    throw new Error('User not found');
  }
  
  return key;
}

async function getUserById(id) {
  const user = await p_user.findOne({
    attributes: {
      exclude: ['USER_AUTH','USER_PASSWORD', 'USER_ACCESSTOKEN', 'IS_DELETED', 'createdAt', 'updatedAt']
    },
    where: { USER_ID: id },
    include: {
      model: p_pet,
      as: 'p_pets',
      where: { IS_DELETED: 0 },
      required: false,
      include:[
        {
          model: p_pet_vaccination,
          as: 'p_pet_vaccinations',
          attributes: { exclude: ['PET_ID'] },
        },{
          model: p_pet_weight,
          as: 'p_pet_weights',
          attributes: { exclude: ['PET_ID'] },
        },
        {
          model: p_pet_eye,
          as: 'p_pet_eyes',
          attributes: { exclude: ['PET_ID','USER_ID'] },
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'IS_DELETED'] }
    }
  });
  if(!user){
    throw new Error('User not found');
  }
  
  return user;
}

async function getUserByEmail(email) {
  const user = await p_user.findOne({
    attributes: {
      exclude: ['IS_DELETED', 'createdAt', 'updatedAt']
    },
    where: { USER_EMAIL: email },
    include: {
      model: p_pet,
      as: 'p_pets',
      where: { IS_DELETED: 0 },
      required: false,
      include:[
        {
          model: p_pet_vaccination,
          as: 'p_pet_vaccinations',
        },{
          model: p_pet_weight,
          as: 'p_pet_weights',
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'IS_DELETED'] }
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

async function getUserByPhone(phone) {
  const user = await p_user.findOne({
    attributes: {
      exclude: ['USER_PASSWORD', 'USER_ACCESSTOKEN', 'IS_DELETED', 'createdAt', 'updatedAt']
    },
    include: {
      model: p_pet,
      as: 'p_pets',
      where: { IS_DELETED: 0 },
      required: false,
      include:[
        {
          model: p_pet_vaccination,
          as: 'p_pet_vaccinations',
        },{
          model: p_pet_weight,
          as: 'p_pet_weights',
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'IS_DELETED'] }
    },
    where: { USER_PHONE: phone }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}


async function getUserByToken(token) {
  const user = await p_user.findOne({
    attributes: {
      exclude: ['USER_PASSWORD', 'IS_DELETED']
    },
    where: { USER_ACCESSTOKEN: token },
    include: {
      model: p_pet,
      attributes: { exclude: ['IS_DELETED'] },
      as: 'p_pets',
      required: false,
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}


async function addUser(user) {
  const existingUser = await p_user.findOne({
    where: {
      [Op.or]: [
        { USER_EMAIL: user.USER_EMAIL },
        { USER_PHONE: user.USER_PHONE }
      ]
    }
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const createdUser = await p_user.create(user);
  
  if (!createdUser) {
    throw new Error('User not created');
  }
  
  return createdUser;
}


async function updateUser(user,id) {
  const checkUser = await p_user.findOne({
    where: { USER_ID: id }
  });
  
  if (!checkUser) {
    throw new Error('User not found');
  }
  
  const checkEmail = await p_user.findOne({
    where: {
      USER_EMAIL: user.USER_EMAIL,
      USER_ID: { [Op.not]: id }
    }
  });
  
  if (checkEmail) {
    throw new Error('Email already exists');
  }
  
  // const checkPhone = await p_user.findOne({
  //   where: {
  //     USER_PHONE: user.USER_PHONE,
  //     USER_ID: { [Op.not]: id }
  //   }
  // });
  
  // if (checkPhone) {
  //   throw new Error('Phone already exists');
  // }
  
  const updatedUser = await p_user.update(user, {
    where: { USER_ID: id }
  });
  
  if (!updatedUser) {
    throw new Error('User not updated');
  }
  
  return user;
}


async function deleteUser(id) {
  const existingUser = await p_user.findOne({ where: { USER_ID: id } });
  
  if (!existingUser) {
    throw new Error('User not found');
  }
  
  const numOfAffectedRows = await p_user.destroy({
    where: { USER_ID: id },
  });

  
  return numOfAffectedRows;
}



module.exports ={
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  getUserByToken,
  addUser,
  updateUser,
  deleteUser,
  uploadUserImg,
  deleteUserImg,
}