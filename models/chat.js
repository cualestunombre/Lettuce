const Sequelize = require("sequelize");
module.exports= class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            content : {
                type:Sequelize.STRING(1000),
            },
            type : {
                type:Sequelize.STRING(20),
                allowNull:false
            },
            reached:{
                type:Sequelize.STRING(20),
                allowNull:false
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Chat',
            tableName:"chats",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.Chat.belongsTo(db.User,{
            'foreignKey':"UserId",
            "sourceKey":"id",
            onDelete: "cascade",
            onUpdate:"cascade"
        });
        db.Chat.belongsTo(db.Room,{
            'foreignKey':"RoomId",
            "sourceKey":"id",
            onDelete: "cascade",
            onUpdate:"cascade"
        });
    }
};