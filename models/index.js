const Sequelize = require("sequelize");
const User =require("./user");
const Post = require("./post");
const PostMedia = require("./postMedia");
const HashTag  = require("./hashtag");
const SessionSocketIdMap= require("./sessionSocketIdMap");
const Room = require("./room");
const Chat = require("./chat");
const Comment = require("./comment");
const config = require("../config.json")["development"];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.User = User; // 컨트롤러에서 접근할 때,
db.Post = Post; // 컨트롤러에서 접근할 때,
db.SessionSocketIdMap=SessionSocketIdMap; // 컨트롤러에서 접근할 때,
db.PostMedia = PostMedia; // 컨트롤러에서 접근할 때,
db.HashTag = HashTag; // 컨트롤러에서 접근할 때,
db.Room = Room; // 컨트롤러에서 접근할 때,
db.Chat = Chat; // 컨트롤러에서 접근할 때,
db.Comment = Comment; // 컨트롤러에서 접근할 때,
Post.init(sequelize);
User.init(sequelize);
PostMedia.init(sequelize);
HashTag.init(sequelize);
Room.init(sequelize);
SessionSocketIdMap.init(sequelize);
Chat.init(sequelize);
Comment.init(sequelize);
Post.associate(db);
User.associate(db);
PostMedia.associate(db);
HashTag.associate(db);
Room.associate(db);
SessionSocketIdMap.associate(db);
Chat.associate(db);
Comment.associate(db);
db.Like = sequelize.models.like; // 컨트롤러에서 접근할 때,
db.Follow = sequelize.models.follow; // 컨트롤러에서 접근할 때,
db.Allocate = sequelize.models.allocate; // 컨트롤러에서 접근할 때,
db.BookMark = sequelize.models.bookmark; // 컨트롤러에서 접근할 때,

module.exports = db;

