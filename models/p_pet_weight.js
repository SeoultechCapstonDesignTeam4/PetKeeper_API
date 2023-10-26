const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_pet_weight', {
    PET_WEIGHT_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    PET_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "펫번호",
      references: {
        model: 'p_pet',
        key: 'PET_ID'
      }
    },
    PET_WEIGHT: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: "몸무게"
    },
    PET_WEIGHT_DATE: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      comment: "몸무게 등록일"
    },
    PET_WEIGHT_TIME: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: "몸무게 등록시간"
    }
  }, {
    sequelize,
    tableName: 'p_pet_weight',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PET_WEIGHT_ID" },
        ]
      },
      {
        name: "FK_pet_weight_PET_ID_pet_PET_ID",
        using: "BTREE",
        fields: [
          { name: "PET_ID" },
        ]
      },
    ]
  });
};
