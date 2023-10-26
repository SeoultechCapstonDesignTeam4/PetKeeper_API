const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_hospital', {
    HOSPITAL_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    HOSPITAL_NAME: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      comment: "병원이름"
    },
    HOSPITAL_PHONE: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "병원전화번호"
    },
    HOSPITAL_ADDRESS: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      comment: "병원주소"
    },
    HOSPITAL_X: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: "X"
    },
    HOSPITAL_Y: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: "Y"
    }
  }, {
    sequelize,
    tableName: 'p_hospital',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "HOSPITAL_ID" },
        ]
      },
    ]
  });
};
