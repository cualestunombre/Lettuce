const express= require("express");
const router = express.Router();
const {Notification,Post,SessionSocketIdMap,User} = require("../models");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
router.post("/like",async(req,res,next)=>{
    const result = await Post.findOne({raw:true,where:{id:req.body.target}});
    await Notification.create({sender:req.body.sender, receiver:result.UserId, type:"like", reached:"false",PostId:result.id});
    const socketId = await SessionSocketIdMap.findAll({raw:true,where:{UserId:result.UserId,type:"notification"}});
    socketId.forEach(ele=>{
        req.app.get("io").of("/notification").to(ele.socketId).emit("notification");
    });
    res.send("ok");
});

router.post("/follow",async(req,res,next)=>{
    await Notification.create({sender:req.body.sender, receiver:req.body.receiver, type:"follow", reached:"false"});
    const socketId = await SessionSocketIdMap.findAll({raw:true,where:{UserId:req.body.receiver,type:"notification"}});
    socketId.forEach(ele=>{
        req.app.get("io").of("/notification").to(ele.socketId).emit("notification");
    });
    res.send("ok");
});

router.post("/comment",async(req,res,next)=>{
    await Notification.create({sender:req.body.sender,receiver:req.body.receiver,type:"comment",reached:"false",PostId:req.body.PostId});
    const socketId = await SessionSocketIdMap.findAll({raw:true,where:{UserId:req.body.receiver,type:"notification"}});
    socketId.forEach(ele=>{
        req.app.get("io").of("/notification").to(ele.socketId).emit("notification");
    });
    res.send("ok");
});

router.get("/socket",async(req,res,next)=>{
    const result = await SessionSocketIdMap.findAll({raw:true,where:{UserId:req.query.id}});
    if(result.length!=0){
        res.send({active:'true'});
    }
    else{
        res.send({});
    }
});

router.post("/room",async(req,res,next)=>{
    const result = await SessionSocketIdMap.findAll({raw:true,where:{UserId:req.body.id,type:"chat"}});
    const query = `select rooms.time, rooms.id  from rooms inner join allocate on allocate.RoomId = rooms.id where allocate.UserId="${req.body.id}" or allocate.UserId="${req.body.user.id}" and rooms.type="one" `;
    const re =  await sequelize.query(query,{type:QueryTypes.SELECT});
    let data = [];
    for (let i=0; i<re.length;i++){
        const query = `select allocate.UserId from allocate where allocate.RoomId="${re[i].id}"`;
        const temp =  await sequelize.query(query,{type:QueryTypes.SELECT});
        if(temp.length==2){
            if(temp[0].UserId==req.body.id&&temp[1].UserId==req.body.user.id){
                data.push(re[i]);
            }
            if(temp[1].UserId==req.body.id&&temp[0].UserId==req.body.user.id){
                data.push(re[i]);
            }
        }
    }
    
    const now = new Date().getTime();
  
        if(now-data[0].time.getTime()>3600*1000 && now-data[0].time.getTime()<3600*1000*24){
            data[0].time=`${parseInt(parseInt((now-data[0].time.getTime())/1000)/3600)}시간전`;
        }
        else if(now-data[0].time.getTime()>=3600*1000*24){
            data[0].time=`${parseInt(parseInt((now-data[0].time)/1000)/(86400))}일전`;
        }
        else if(now-data[0].time.getTime()<=60*1000){
            data[0].time=`${parseInt((now-data[0].time.getTime())/1000)}초전`;
        }
        else{
            data[0].time=`${parseInt(parseInt((now-data[0].time.getTime())/1000)/60)}분전`;
        }
  
    result.forEach(ele=>{
        req.app.get("io").of("/chat").to(ele.socketId).emit("room",{id:req.body.user.id,nickName:req.body.user.nickName, email:req.body.user.email,profile:req.body.user.profile,RoomId:data[0].id,time:data[0].time});
    });
    res.send("ok");
});







module.exports = router;

