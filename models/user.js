const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            nickName: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            birthday: {
                type: Sequelize.DATEONLY,
                allowNull: true

            },
            profile: {
                type: Sequelize.STRING(300),
                defaultValue: "/static/image/default.jpg"
            },
            comment: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            provider: {
                type: Sequelize.STRING(50),
                allowNull: true
            }

        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: "users",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci"
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post, { foreignKey: "UserId", targetKey: "id" });
        db.User.belongsToMany(db.User, {
            foreignKey: "follower",
            through: "follow",
            as: "followers"
        });
        db.User.belongsToMany(db.User, {
            foreignKey: "followed",
            through: "follow",
            as: "followings"
        });
        db.User.belongsToMany(db.Post, { through: 'likes', onDelete: "cascade", onUpdate: "cascade" });
        db.User.belongsToMany(db.Post, { through: "bookmark", onDelete: "cascade", onUpdate: "cascade" });
        db.User.belongsToMany(db.Room, { 'through': 'allocate', onDelete: "cascade", onUpdate: "cascade" });
        db.User.hasMany(db.SessionSocketIdMap, {
            'foreignKey': "UserId",
            'targetKey': "id",
            onDelete: "cascade",
            onUpdate: "cascade"
        });
        db.User.hasMany(db.Comment,{
            'foreignKey':"UserId",
            'targetKey':"id",
            onDelete:"cascade",
            onUpdate:"cascade"
        });
        db.User.hasMany(db.Chat,{
            'foreignKey':"UserId",
            "targetKey":"id",
            onUpdate:"cascade"
        });
        db.User.hasMany(db.Notification,{
            'foreignKey':"sender",
            "targetKey":"id",
            onDelete:'cascade',
            onUpdate:"cascade"
        });
        db.User.hasMany(db.Notification,{
            'foreignKey':"receiver",
            "targetKey":"id",
            onDelete:'cascade',
            onUpdate:"cascade"
        });
    }
};
