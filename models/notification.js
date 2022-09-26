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
        db.Notification.belongsTo(db.User,{'foreignKey':'sender','sourceKey':'id',onUpdate:'cascade',onDelete:'cascade'});
        db.Notification.belongsTo(db.User,{'foreignKey':'receiver','sourceKey':'id',onUpdate:'cascade',onDelete:'cascade'});
        db.Notification.belongsTo(db.Post,{'foreignKey':"PostId","sourceKey":"id","onDelete":"cascade","onUpdate":"cascade"});
    
};
}