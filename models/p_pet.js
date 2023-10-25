const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_pet', {
    PET_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "애완동물 고유번호"
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "FK_user 고유번호",
      references: {
        model: 'p_user',
        key: 'USER_ID'
      }
    },
    PET_NAME: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      comment: "애완동물 이름"
    },
    PET_KIND: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "애완동물 종류(강아지 고양이)"
    },
    PET_GENDER: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "애완동물 성별"
    },
    PET_BIRTHDATE: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      comment: "애완동물 출생일"
    },
    PET_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: "https:\/\/petkeeper.s3.ap-northeast-2.amazonaws.com\/pet-profile\/default-img",
      comment: "애완동물 프로필사진"
    },
    PET_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PET_TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    IS_DELETED: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'p_pet',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PET_ID" },
        ]
      },
      {
        name: "fk_p_pet_USER_ID_p_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
    ]
  });
};
