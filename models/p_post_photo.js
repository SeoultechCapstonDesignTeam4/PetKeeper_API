const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_post_photo', {
    PHOTO_ID: {
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
    },
    PHOTO_PATH: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PHOTO_UPLOADED_DATE: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'p_post_photo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PHOTO_ID" },
        ]
      },
      {
        name: "FK_post_photo_USER_ID_FK_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "FK_post_photo_POST_ID_FK_post_POST_ID",
        using: "BTREE",
        fields: [
          { name: "POST_ID" },
        ]
      },
    ]
  });
};
