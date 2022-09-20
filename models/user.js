const Sequelize = require("sequelize");

module.exports= class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type: Sequelize.STRING(50),
                allowNull : false,
                unique : true
            },
            password:{
                type: Sequelize.STRING(100),
                allowNull : false
            },
            nickName: {
                type: Sequelize.STRING(10),
                allowNull : false,
            },
            birthday : {
                type: Sequelize.DATEONLY,
                allowNull : false

            },
            profile:{
                type: Sequelize.STRING(100),
                defaultValue : "/static/image/default.jpg"
            },
            comment:{
                type: Sequelize.STRING(50),
                allowNull:true
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'User',
            tableName:"users",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.User.hasMany(db.Post,{foreignKey:"UserId",targetKey:"id"});
        db.User.belongsToMany(db.User,{
            foreignKey:"follower",
            through:"follow",
            as:"follwers"
        });
        db.User.belongsToMany(db.User,{
            foreignKey:"followed",
            through:"follow",
            as:"followings"
        });
        db.User.belongsToMany(db.Post,{through:'like',onDelete: "cascade",onUpdate:"cascade"});
        db.User.belongsToMany(db.Post,{through:"bookmark",onDelete: "cascade",onUpdate:"cascade"});
        db.User.belongsToMany(db.Room,{'through':'allocate',onDelete: "cascade",onUpdate:"cascade"});
        db.User.hasMany(db.SessionSocketIdMap,{
            'foreignKey':"UserId",
            'targetKey':"id",
            ondelete:"cascade",
            onupdate:"cascade"
        });
        db.User.hasMany(db.Chat,{
            'foreignKey':"UserId",
            "targetKey":"id",
            onUpdate:"cascade"
        });
    }
};
