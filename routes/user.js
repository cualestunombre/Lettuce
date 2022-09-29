const express= require("express");
const router = express.Router();
const { isLoggedIn } = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const {Sequelize:{Op}} = require("sequelize");
const {Notification,User} = require("../models");
router.get("/",isLoggedIn,async (req,res,next)=>{
    const info = req.query.search;
    const arr=[];
    const query1= `select id,nickName,email,profile from users where nickName LIKE "${info}%"`;
    const query2 = `select id,nickName,email,profile from users where email LIKE "${info}%"`;
    const data1 =  await sequelize.query(query1,{type:QueryTypes.SELECT});
    const data2 =  await sequelize.query(query2,{type:QueryTypes.SELECT});
    data1.forEach(ele=>{
        arr.push(ele);
    });
    data2.forEach(ele=>{
        arr.push(ele);
    })
    res.send(arr);
});
router.get("/notification",isLoggedIn,async(req,res,next)=>{
    const result = await Notification.findAll({where:{receiver:req.user.id, reached:"false", type: {[Op.ne]:"chat"},}});
    res.send({cnt:result.length});
});
router.get("/notificationInfo",isLoggedIn,async(req,res,next)=>{
    const result = await Notification.findAll({raw:true,where:{receiver:req.user.id},order:[['createdAt','DESC']],include:[
        {model:User, as:"send",attributes:["nickName","profile"]}
    ]});
    await Notification.update({reached:"true"},{where:{receiver:req.user.id}});
    const now = new Date().getTime();
    const filtered = [];
    result.forEach(ele=>{
        if(now-ele.createdAt.getTime()<3600*25*1000){
            filtered.push(ele);
        }
    });
    filtered.forEach(ele=>{
        if(now-ele.createdAt.getTime()>3600*1000){
            ele.time=`${parseInt(parseInt((now-ele.createdAt.getTime())/1000)/3600)}시간전`;
        }
        else if(now-ele.createdAt.getTime()<=60*1000){
            ele.time=`${parseInt((now-ele.createdAt.getTime())/1000)}초전`;
        }
        else{
            ele.time=`${parseInt(parseInt((now-ele.createdAt.getTime())/1000)/60)}분전`;
        }
    });
    res.send({data:filtered});
});

module.exports=router;