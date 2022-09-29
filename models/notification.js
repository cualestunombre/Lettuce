const Sequelize = require("sequelize");
module.exports= class Notification extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            reached:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            type:{
                type: Sequelize.STRING(20),
                allowNull: false
            },
            RoomId:{
                type: Sequelize.STRING(20),
                allowNull:true 
            }
            
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Notification',
            tableName:"notifications",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.Notification.belongsTo(db.User,{'as':'send','foreignKey':'sender','sourceKey':'id',onUpdate:'cascade',onDelete:'cascade'});
        db.Notification.belongsTo(db.User,{'as':"receive",'foreignKey':'receiver','sourceKey':'id',onUpdate:'cascade',onDelete:'cascade'});
        db.Notification.belongsTo(db.Post,{'foreignKey':"PostId","sourceKey":"id","onDelete":"cascade","onUpdate":"cascade"});
    
};
}