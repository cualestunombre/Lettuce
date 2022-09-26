const express= require("express");
const router = express.Router();
const { isLoggedIn } = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const {Notification} = require("../models");
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
router.get("notification",isLoggedIn,async(req,res,next)=>{
    const result = await Notification.findAll({where:{UserId:req.user.id, reached:"false"}});
    res.send({cnt:result});
});


module.exports=router;