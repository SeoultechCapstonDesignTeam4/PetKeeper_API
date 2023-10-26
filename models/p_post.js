const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_post', {
    POST_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "글 번호"
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "작성자 번호",
      references: {
        model: 'p_user',
        key: 'USER_ID'
      }
    },
    POST_CONTENT: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "글 내용"
    },
    POST_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      comment: "글 이미지URL"
    },
    POST_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "글 작성일"
    },
    POST_TIME: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: "글 작성시간"
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
