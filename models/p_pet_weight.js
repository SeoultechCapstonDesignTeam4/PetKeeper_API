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
      references: {
        model: 'p_pet',
        key: 'PET_ID'
      }
    },
    PET_WEIGHT: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    PET_WEIGHT_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PET_WEIGHT_TIME: {
      type: DataTypes.TIME,
      allowNull: true
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
