const SocketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const {User,SessionSocketIdMap} = require("./models");
const passport = require("passport");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("./models");
const axios = require("axios");
module.exports = (server,app,sessionMiddleware)=>{
    const io = SocketIO(server,{path:'/socket.io'});
    app.set("io",io);
    const wrap = middleware => (socket,next)=>middleware(socket.request,{},next);
    const notification = io.of("/notification");
    const chat = io.of("/chat");// 채팅 알림
    const room = io.of("/room");
    notification.use(wrap(sessionMiddleware));
    notification.use(wrap(passport.initialize())); //req에 passport 설정을 심는다
    notification.use(wrap(passport.session())); // req.session에 passport 정보를 저장한다 {express-session과 연동하는 것}
    notification.on("connection",async (socket)=>{
        const req = socket.request;
        if(req.user){
            await SessionSocketIdMap.create({socketId:socket.id,sessionId:req.session.id,UserId:req.user.id,type:"notification"});
            const query = `select sessionSocketIdMap.socketId from sessionSocketIdMap inner join follow on sessionSocketIdMap.UserId
            = follow.follower where follow.followed="${req.user.id}";
            `;
            const data =  await sequelize.query(query,{type:QueryTypes.SELECT});
          
             data.forEach(ele=>{
                
                    socket.to(ele.socketId).emit("active",{UserId:req.user.id});
                
            });
            
        }
        
        socket.on("disconnect",async()=>{
            await SessionSocketIdMap.destroy({where:{socketId:socket.id}});
            const query = `select sessionSocketIdMap.socketId from sessionSocketIdMap inner join follow on sessionSocketIdMap.UserId
            = follow.follower where follow.followed="${req.user.id}";
            `;
            const response = await SessionSocketIdMap.findAll({raw:true,where:{UserId:req.user.id}});
            const data =  await sequelize.query(query,{type:QueryTypes.SELECT});
            if(response.length==0){
                data.forEach(ele=>{
                    if(response.length==0){
                        socket.to(ele.socketId).emit("inactive",{UserId:req.user.id});
                    }
                });
            }
        }); 
    });
    chat.use(wrap(sessionMiddleware));
    chat.use(wrap(passport.initialize()));
    chat.use(wrap(passport.session()));
    chat.on("connection",async(socket)=>{
        const req = socket.request;
        if(req.user){
            await SessionSocketIdMap.create({socketId:socket.id,sessionId:req.session.id,UserId:req.user.id,type:"chat"});
        }
        socket.on("disconnect",async()=>{
            await SessionSocketIdMap.destroy({where:{socketId:socket.id}});

        });
    });
    room.use(wrap(sessionMiddleware));
    room.use(wrap(passport.initialize()));
    room.use(wrap(passport.session()));
    room.on("connection",async(socket)=>{
        const req = socket.request;
        const {headers:{referer}} = req;
        socket.join(referer);
        
        room.to(referer).emit("enter",{id:req.user.id});
        await SessionSocketIdMap.create({socketId:socket.id, sessionId:req.session.id,UserId:req.user.id, type:referer.split("/").pop()});
        socket.on("onTyping",(data)=>{
            room.to(referer).emit("onTyping",{data:req.user.id});
            console.log(referer);
        });
        socket.on("disconnect",async()=>{
            room.to(referer).emit("exit",{id:req.user.id});
            await SessionSocketIdMap.destroy({where:{socketId:socket.id}});

        });
        
    });
}