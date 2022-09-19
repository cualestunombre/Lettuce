const Sequelize = require("sequelize");
module.exports= class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            hashtag:{
                type:Sequelize.STRING(20),
                allowNull:false
            },
        },{
            sequelize,
            timestamps: true,
            underscored:false,
            modelName:'Hashtag',
            tableName:"hashtags",
            paranoid:false,
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
    static associate(db){
        db.HashTag.belongsTo(db.Post,{
            'foreignKey':"PostId",
            "sourceKey":"id",
            onDelete: "cascade",
            onUpdate:"cascade"
        });
    }
};