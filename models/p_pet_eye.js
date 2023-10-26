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
      allowNull: true,
      comment: "유저번호"
    },
    PET_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "펫번호",
      references: {
        model: 'p_pet',
        key: 'PET_ID'
      }
    },
    EYE_STATE: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "상태"
    },
    EYE_NORMAL: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "정상"
    },
    EYE_CONJUNCTIVITIS: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "결막염"
    },
    EYE_CATARACT: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "백내장"
    },
    EYE_GALACTORRHEA: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "유루증"
    },
    EYE_PIGMENTED_KERATITIS: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "색소침착성 각막염"
    },
    EYE_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      comment: "이미지링크"
    },
    EYE_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    EYE_TIME: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p_pet_eye',
    timestamps: false,
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
