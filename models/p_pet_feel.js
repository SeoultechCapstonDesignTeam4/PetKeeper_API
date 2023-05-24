const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_pet_feel', {
    FEEL_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "Feel 고유번호"
    },
    PET_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "FK_pet 고유번호",
      references: {
        model: 'p_pet',
        key: 'PET_ID'
      }
    },
    FEEL_KIND: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "감정 종류(angry...)"
    },
    FEEL_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      comment: "Feel_이미지 URL"
    },
    creatdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'p_pet_feel',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FEEL_ID" },
        ]
      },
      {
        name: "pet_feel_PET_ID_pet_PET_ID",
        using: "BTREE",
        fields: [
          { name: "PET_ID" },
        ]
      },
    ]
  });
};
