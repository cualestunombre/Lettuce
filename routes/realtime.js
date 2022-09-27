const express= require("express");
const router = express.Router();
const {Notification,Post,SessionSocketIdMap} = require("../models");
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










module.exports = router;

