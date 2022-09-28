const express = require("express");
const router = express.Router();
const axios = require("axios");
const {Follow,User,Room,Allocate} = require("../models");
const {isLoggedIn, isNotLoggedIn} = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
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
    console.log(arr);
    console.log(data);
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
    res.render("room");
});
module.exports = router;
