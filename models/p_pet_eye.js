const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_pet_eye', {
    EYE_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    PET_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'p_pet',
        key: 'PET_ID'
      }
    },
    EYE_STATE: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    EYE_CONJUNCTIVITIS: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    EYE_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p_pet_eye',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "EYE_ID" },
        ]
      },
      {
        name: "fk_p_eye_USER_ID_fk_p_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "fk_p_eye_PET_ID_fk_p_pet_PET_ID",
        using: "BTREE",
        fields: [
          { name: "PET_ID" },
        ]
      },
    ]
  });
};
