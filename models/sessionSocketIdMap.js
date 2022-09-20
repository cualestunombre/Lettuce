const Sequelize = require("sequelize");
module.exports= class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            socketId:{
                type: Sequelize.STRING(100),
                allowNull: false,
                unique:true
            },
            sessionId:{
                type: Sequelize.STRING(100),
                allowNull:false
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'SessionSocketIdMap',
            tableName:"sessionSocketIdMap",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.SessionSocketIdMap.belongsTo(db.User,{
            'foreignKey':"UserId",
            'sourceKey':"id",
            ondelete:"cascade",
            onupdate:"cascade"
        });
    
};
}