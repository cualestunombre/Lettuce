const express = require("express");
const router = express.Router();
const axios = require("axios");
const {Follow,User,Room,Allocate,Chat,SessionSocketIdMap} = require("../models");
const {isLoggedIn, isNotLoggedIn} = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const {Sequelize:{Op}}=require("sequelize");
router.get("/",isLoggedIn,async(req,res,next)=>{
    const data = await User.findAll({raw:true,include:[{model:User,as:"followings",attributes:['id','email','nickName','profile','comment'],where:{id:req.user.id}}]});//팔로잉 정보
    const rooms = await Allocate.findAll({raw:true,attributes:["RoomId"],where:{UserId:req.user.id}});
    const arr=[];
    for(let i=0; i<rooms.length;i++){
        const query = `select * from rooms inner join allocate on allocate.RoomId = rooms.id inner join users on allocate.UserId= users.id where allocate.RoomId="${rooms[i].RoomId}"`;
        const data = await sequelize.query(query,{type:QueryTypes.SELECT});
        data.forEach(ele=>{
            if(ele.UserId!=req.user.id){
                arr.push(ele);
            }
        });
    }
    arr.sort((a,b)=>{
        return b.time-a.time;
    });
    for(let i=0; i<arr.length; i++){
        const now = new Date().getTime();
        if(now-arr[i].time.getTime()>3600*1000 && now-arr[i].time.getTime()<3600*1000*24){
            arr[i].time=`${parseInt(parseInt((now-arr[i].time.getTime())/1000)/3600)}시간전`;
        }
        else if(now-arr[i].time.getTime()>=3600*1000*24){
            arr[i].time=`${parseInt(parseInt((now-arr[i].time)/1000)/(86400))}일전`;
        }
        else if(now-arr[i].time.getTime()<=60*1000){
            arr[i].time=`${parseInt((now-arr[i].time.getTime())/1000)}초전`;
        }
        else{
            arr[i].time=`${parseInt(parseInt((now-arr[i].time.getTime())/1000)/60)}분전`;
        }
    }
    res.render("chat",{data:data,room:arr});
});
router.get("/enter",isLoggedIn,async(req,res,next)=>{
    const id = req.query.id;
    const data = await Allocate.findAll({raw:true,where:{UserId:req.user.id}});
    const data2 = await Allocate.findAll({raw:true,where:{UserId:req.query.id}});
    const arr=[];
    for (let i=0; i<data.length; i++){
        for(j=0;j<data2.length;j++){
            if(data[i].RoomId==data2[j].RoomId){
                const data3 = await Room.findAll({raw:true,where:{id:data[i].RoomId, type:"one"}});
                if (data3.length!=0){
                    arr.push(data[i].RoomId);
                }
            }
        }
    }
    if(arr.length!=0){
        res.send({url:`/chat/room/${arr[0]}`});
    }
    else{
        const data = await Room.create({type:"one",time:new Date()});
        await Allocate.create({UserId:req.user.id,RoomId:data.dataValues.id});
        await Allocate.create({UserId:id,RoomId:data.dataValues.id});
        await axios.post("http://localhost:8000/realtime/room",{id:id,user:req.user}); 
        res.send({url:`/chat/room/${data.dataValues.id}`});
    }
});
router.get("/room/:id",isLoggedIn,async(req,res,next)=>{
    const query = `select * from users inner join allocate on users.id=allocate.UserId where allocate.RoomId="${req.params.id}" and users.id!="${req.user.id}"`;
    const data = await sequelize.query(query,{type:QueryTypes.SELECT});
    console.log(data);
    res.render("room",{id:req.params.id,data:data,me:req.user.id});
});

router.get("/comment",isLoggedIn,async(req,res,next)=>{
    
    const id = req.query.id;
    const cnt = req.query.count;
    const offset = req.query.offset;
    const num = parseInt(cnt)*10+parseInt(offset);
    const query = `select * from users inner join chats on users.id=chats.UserId where chats.RoomId="${id}" order by chats.createdAt DESC limit ${10} offset ${num} `;
    const data = await sequelize.query(query,{type:QueryTypes.SELECT});
    if(data.length==0){
        res.send({code:400});
    }
    else{
        res.send({code:200,data:data});
    }
});
router.post("/chat",isLoggedIn,async (req,res,next)=>{
    await Chat.create({content:req.body.content, type:"one",UserId:req.user.id,RoomId:req.body.roomId});
    await Room.update({time:new Date()},{where:{id:req.body.roomId}});
    req.app.get("io").of("/room").to(req.headers.referer).emit("message",{profile:req.user.profile, nickName:req.user.nickName,content:req.body.content, UserId:req.user.id});
    const query2 = `select *  from sessionSocketIdMap inner join allocate on sessionSocketIdMap.UserId = allocate.UserId inner join rooms on rooms.id = allocate.RoomId where rooms.id="${req.body.roomId}" and sessionSocketIdMap.UserId !="${req.user.id}"`;
    const result =  await sequelize.query(query2,{type:QueryTypes.SELECT});
    const query = `select rooms.time, rooms.id  from rooms inner join allocate on allocate.RoomId = rooms.id where rooms.id="${req.body.roomId}" and rooms.type="one"`;
    const data =  await sequelize.query(query,{type:QueryTypes.SELECT});
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
        req.app.get("io").of("/chat").to(ele.socketId).emit("chat",{id:req.user.id,nickName:req.user.nickName, email:req.user.email,profile:req.user.profile,RoomId:data[0].id,time:data[0].time});
    });
    res.send({code:200});

});

module.exports = router;
