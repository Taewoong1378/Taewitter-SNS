const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          // 해시태그 이름만 생성
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Hashtag',
        tableName: 'hashtags',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  static associate(db) {
    // 게시글과 해시태그는 다대다 관계, 따라서 PostHashtag라는 중간 테이블 생성
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};
