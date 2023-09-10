const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_community', {
    COMMUNITY_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    COMMUNITY_USER_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    COMMUNITY_TITLE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    COMMUNITY_TEXT: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p_community',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "COMMUNITY_ID" },
        ]
      },
    ]
  });
};
