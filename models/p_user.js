const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p_user', {
    USER_ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 고유 ID"
    },
    USER_EMAIL: {
      type: DataTypes.CHAR(30),
      allowNull: true,
      comment: "사용자 이메일"
    },
    USER_PASSWORD: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      comment: "사용자 비밀번호"
    },
    USER_NAME: {
      type: DataTypes.CHAR(11),
      allowNull: true,
      comment: "사용자 이름"
    },
    USER_PHONE: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      comment: "사용자 핸드폰"
    },
    USER_ACCESSTOKEN: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      comment: "사용자 접속 토큰"
    },
    USER_BIRTHDATE: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "사용자 생일"
    },
    USER_IMAGE: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: "https:\/\/petkeeper.s3.ap-northeast-2.amazonaws.com\/user-profile\/default-img",
      comment: "사용자 프로필 이미지"
    },
    USER_AUTH: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: "normal",
      comment: "사용자 권한"
    },
    IS_DELETED: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    USER_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    USER_TIME: {
      type: DataTypes.TIME,
      allowNull: true
    },
    USER_OAUTH_ID: {
      type: DataTypes.CHAR(200),
      allowNull: true
    },
    USER_OAUTH_PROVIDER: {
      type: DataTypes.CHAR(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p_user',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "UK_PHONE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "USER_PHONE" },
          { name: "USER_EMAIL" },
        ]
      },
    ]
  });
};
