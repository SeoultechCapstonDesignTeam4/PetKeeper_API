const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_post_like', {
    LIKE_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    POST_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'p_post',
        key: 'POST_ID'
      }
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'p_user',
        key: 'USER_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'p_post_like',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "LIKE_ID" },
        ]
      },
      {
        name: "FK_post_like_USER_ID_FK_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "FK_post_like_POST_ID_FK_post_POST_ID",
        using: "BTREE",
        fields: [
          { name: "POST_ID" },
        ]
      },
    ]
  });
};
