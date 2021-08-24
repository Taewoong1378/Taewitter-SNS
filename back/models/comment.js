const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.TEXT,
        // 댓글 글자수 무제한
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsToMany(db.Comment, {
      foreignKey: 'ParentId',
      through: 'Response',
      as: 'Parent',
    });
    db.Comment.belongsToMany(db.Comment, {
      foreignKey: 'ChildId',
      through: 'Response',
      as: 'Child',
    });
  }
};
