const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_pet_vaccination', {
    PET_VACCINATION_ID: {
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
    PET_VACCINATION_NAME: {
      type: DataTypes.CHAR(40),
      allowNull: true
    },
    PET_VACCINATION_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PET_VACCINATION_PERIOD: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p_pet_vaccination',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PET_VACCINATION_ID" },
        ]
      },
      {
        name: "FK_pet_scan_PET_ID_pet_PET_ID",
        using: "BTREE",
        fields: [
          { name: "PET_ID" },
        ]
      },
    ]
  });
};
