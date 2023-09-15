const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_post', {
    POST_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'p_user',
        key: 'USER_ID'
      }
    },
    POST_TITLE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    POST_CONTENT: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    POST_UPLOAD_DATE: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'p_post',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "POST_ID" },
        ]
      },
      {
        name: "FK_post_USER_ID_FK_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
    ]
  });
};