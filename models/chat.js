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
            },
            src:{
                type:Sequelize.STRING(200),
                allowNull:true
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Chat',
            tableName:"chats",
            paranoid:false,
            charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
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