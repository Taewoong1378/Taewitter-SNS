const Sequelize = require('sequelize');

module.exports = class Image extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      src: {
        type: Sequelize.STRING(200),
        // 이미지는 url이기 때문에 src가 매우 길어질 수 있다.
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Image',
      tableName: 'images',
      paranoid: false,
      charset: 'utf',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
};

