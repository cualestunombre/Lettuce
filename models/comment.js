const Sequelize = require("sequelize");
module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Comment',
            tableName: "comments",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Comment.belongsTo(db.User, { foreignKey: "UserId", sourceKey: "id", onDelete: "cascade", onUpdate: "cascade" });
        db.Comment.belongsTo(db.Post,{ foreignKey: "PostId", sourceKey: "id", onDelete: "cascade", onUpdate: "cascade" });
        
    }
};