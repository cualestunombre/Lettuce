const Sequelize = require("sequelize");
module.exports= class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            src:{
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            type:{
                type: Sequelize.STRING(10),
                allowNull:false
            }
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Postmedia',
            tableName:"postmedia",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.PostMedia.belongsTo(db.Post,{foreignKey:"PostId",sourceKey:"id",onDelete: "cascade",onUpdate:"cascade"});
        
    }
};