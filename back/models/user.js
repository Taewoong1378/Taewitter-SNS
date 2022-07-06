const Sequelize = require('sequelize');

// users 테이블 생성
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
          // 이메일이 둘 다 null이여도 이건 unique한걸로 친다.
          // 따라서 allowNull: true와 unique: true 함께 사용 가능
        },
        nickname: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        password: {
          // 비밀번호를 암호화할 때 글자수가 늘어나므로 100글자로 해줌
          // 비밀번호가 없는 경우가 있나? 있다 -> 카카오로 로그인 할 때
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          // provider : 로그인 제공자
          type: Sequelize.STRING(10),
          allowNull: false,
          // provider의 값이 'kakao'면 카카오로 로그인하는 것
          // 하지만 로컬 로그인이 기본이므로 defaultvalue 값을 local로 두었음.
          defaultValue: 'local',
        },
        snsId: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        accessToken: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        // timestamps: true, paranoid: true의 기능 :
        // createdAt, updatedAt, deletedAt, 즉 생성일, 수정일, 삭제일이 기록됨
        // createdAt, updatedAt, deletedAt 컬럼이 함께 생성되는 것!
        // paranoid: true이기 때문에 아이디를 삭제해도 그 정보가 남아있음
      },
    );
  }

  static associate(db) {
    // 유저와 게시글은 일대다 관계
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.User, {
      // 사용자 테이블 간의 관계 (팔로워와 팔로잉 관계)
      // Uesr 테이블이 서로를 참조하기 때문에 forergin key를 설정해주지 않을 경우 둘다 User id를 참조하여 어떤 것이 팔로워고 팔로우인지 알 수 없음. 따라서 팔로잉 아이디와 팔로워 아이디를 외래키로 설쟁해준다.

      // 즉, 밑에 코드는 팔로워를 찾을 때 follwing id를 보고 가져온다는 것.
      foreignKey: 'FollowingId',
      through: 'Follow',
      as: 'Followers',
    });

    db.User.belongsToMany(db.User, {
      // 밑에 코드는 팔로잉을 찾을 때 follwer id를 보고 가져온다는 것.
      foreignKey: 'FollowerId',
      through: 'Follow',
      as: 'Followings',
    });
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
  }
};
