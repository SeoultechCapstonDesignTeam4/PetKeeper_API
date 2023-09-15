var DataTypes = require("sequelize").DataTypes;
var _p_eye = require("./p_eye");
var _p_hospital = require("./p_hospital");
var _p_pet = require("./p_pet");
var _p_pet_feel = require("./p_pet_feel");
var _p_post = require("./p_post");
var _p_post_like = require("./p_post_like");
var _p_post_photo = require("./p_post_photo");
var _p_user = require("./p_user");

function initModels(sequelize) {
  var p_eye = _p_eye(sequelize, DataTypes);
  var p_hospital = _p_hospital(sequelize, DataTypes);
  var p_pet = _p_pet(sequelize, DataTypes);
  var p_pet_feel = _p_pet_feel(sequelize, DataTypes);
  var p_post = _p_post(sequelize, DataTypes);
  var p_post_like = _p_post_like(sequelize, DataTypes);
  var p_post_photo = _p_post_photo(sequelize, DataTypes);
  var p_user = _p_user(sequelize, DataTypes);

  p_eye.belongsTo(p_pet, { as: "PET", foreignKey: "PET_ID"});
  p_pet.hasMany(p_eye, { as: "p_eyes", foreignKey: "PET_ID"});
  p_pet_feel.belongsTo(p_pet, { as: "PET", foreignKey: "PET_ID"});
  p_pet.hasMany(p_pet_feel, { as: "p_pet_feels", foreignKey: "PET_ID"});
  p_post_like.belongsTo(p_post, { as: "POST", foreignKey: "POST_ID"});
  p_post.hasMany(p_post_like, { as: "p_post_likes", foreignKey: "POST_ID"});
  p_post_photo.belongsTo(p_post, { as: "POST", foreignKey: "POST_ID"});
  p_post.hasMany(p_post_photo, { as: "p_post_photos", foreignKey: "POST_ID"});
  p_eye.belongsTo(p_user, { as: "USER", foreignKey: "USER_ID"});
  p_user.hasMany(p_eye, { as: "p_eyes", foreignKey: "USER_ID"});
  p_pet.belongsTo(p_user, { as: "USER", foreignKey: "USER_ID"});
  p_user.hasMany(p_pet, { as: "p_pets", foreignKey: "USER_ID"});
  p_post.belongsTo(p_user, { as: "USER", foreignKey: "USER_ID"});
  p_user.hasMany(p_post, { as: "p_posts", foreignKey: "USER_ID"});
  p_post_like.belongsTo(p_user, { as: "USER", foreignKey: "USER_ID"});
  p_user.hasMany(p_post_like, { as: "p_post_likes", foreignKey: "USER_ID"});
  p_post_photo.belongsTo(p_user, { as: "USER", foreignKey: "USER_ID"});
  p_user.hasMany(p_post_photo, { as: "p_post_photos", foreignKey: "USER_ID"});

  return {
    p_eye,
    p_hospital,
    p_pet,
    p_pet_feel,
    p_post,
    p_post_like,
    p_post_photo,
    p_user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
