const Sequelize = require("sequelize");
module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING(100),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: "posts",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User, { foreignKey: "UserId", sourceKey: "id", onDelete: "cascade", onUpdate: "cascade" });
        db.Post.belongsToMany(db.User, { through: "bookmark", onDelete: "cascade", onUpdate: "cascade" });
        db.Post.hasMany(db.PostMedia, { foreignKey: "PostId", targetKey: "id", onDelete: "cascade", onUpdate: "cascade" });
        db.Post.hasMany(db.HashTag, {
            'foreignKey': "PostId",
            "TargetKey": "id"
            , onDelete: "cascade", onUpdate: "cascade"
        });
    }
};