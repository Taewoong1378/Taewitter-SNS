const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      host: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      type: {
        // ENUM을 쓰면 문자열이지만 'free'나 'premium' 둘 중 하나만 사용 가능
        // 요금제 책정
        type: Sequelize.ENUM('free', 'premium'),
        allowNull: false,
      },
      // REST_API 키
      clientSecret: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Domain',
      tableName: 'domains',
    });
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
