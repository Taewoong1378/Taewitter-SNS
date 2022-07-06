const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT,
          // 글자수 무제한
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Post',
        tableName: 'posts',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        // paranoid: false이기 때문에 만약에 게시물이 삭제되면 진짜로 삭제됨
      },
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    // 리트윗 관계 (1:다 관계, 하나의 게시물을 리트릿해서 똑같은 여러개의 게시물 생성)
    db.Post.belongsTo(db.Post, { as: 'Retweet' });

    // 게시글과 해시태그는 다대다 관계, 따라서 PostHashtag라는 중간 테이블 생성
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

    // 나중에 as에 따라서 post.getLLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
  }
};
