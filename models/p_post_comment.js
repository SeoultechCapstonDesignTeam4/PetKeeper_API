const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_post_comment', {
    COMMENT_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    USER_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "댓글 작성자",
      references: {
        model: 'p_user',
        key: 'USER_ID'
      }
    },
    POST_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "댓글 작성된 글",
      references: {
        model: 'p_post',
        key: 'POST_ID'
      }
    },
    COMMENT_TEXT: {
      type: DataTypes.CHAR(200),
      allowNull: true,
      comment: "댓글 내용"
    },
    COMMENT_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "댓글 작성일"
    },
    COMMENT_TIME: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: "댓글 작성시각"
    }
  }, {
    sequelize,
    tableName: 'p_post_comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "COMMENT_ID" },
        ]
      },
      {
        name: "FK_post_comment_USER_ID_FK_user_USER_ID",
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "FK_post_comment_POST_ID_FK_post_POST_ID",
        using: "BTREE",
        fields: [
          { name: "POST_ID" },
        ]
      },
    ]
  });
};
