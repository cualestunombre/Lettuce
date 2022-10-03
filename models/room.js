const Sequelize = require("sequelize");
module.exports= class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            type:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            time:{
                type: Sequelize.DATE,
                allowNull:true
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Room',
            tableName:"rooms",
            paranoid:false,
            charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        });
    }
    static associate(db){
        db.Room.belongsToMany(db.User,{'through':'allocate',onUpdate:'cascade',onDelete:'cascade'});
        db.Room.hasMany(db.Chat,{
            'foreignKey':"UserId",
            "targetKey":"id",
            onUpdate:"cascade"
        });
    
};
}