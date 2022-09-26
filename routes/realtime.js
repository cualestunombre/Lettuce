const express= require("express");
const router = express.Router();
const {Notification,Post,SessionSocketIdMap} = require("../models");
router.post("/like",async(req,res,next)=>{
    const result = await Post.findOne({raw:true,where:{id:req.body.target}});
    await Notification.create({sender:req.body.sender, receiver:result.UserId, type:"like", reached:"false",PostId:result.id});
    const socketId = await SessionSocketIdMap.findAll({raw:true,where:{UserId:result.UserId}});
    socketId.forEach(ele=>{
        req.app.get("io").of("/notification").to(ele.socketId).emit("notification");
    });
    res.send("ok");
});










module.exports = router;

