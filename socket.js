const SocketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const {User,SessionSocketIdMap} = require("./models");
const passport = require("passport");
module.exports = (server,app,sessionMiddleware)=>{
    const io = SocketIO(server,{path:'/socket.io'});
    app.set("io",io);
    const wrap = middleware => (socket,next)=>middleware(socket.request,{},next);
    const notification = io.of("/notification");
    notification.use(wrap(sessionMiddleware));
    notification.use(wrap(passport.initialize())); //req에 passport 설정을 심는다
    notification.use(wrap(passport.session())); // req.session에 passport 정보를 저장한다 {express-session과 연동하는 것}
    notification.on("connection",async (socket)=>{
        const req = socket.request;
        if(req.user){
            await SessionSocketIdMap.create({socketId:socket.id,sessionId:req.session.id,UserId:req.user.id});
        }
        socket.on("disconnect",async()=>{
            await SessionSocketIdMap.destroy({where:{socketId:socket.id}});
        }); 
       
    });
}