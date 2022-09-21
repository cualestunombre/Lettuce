const express= require("express");
const router = express.Router();
const {User} = require("../models");
router.get("/",async (req,res,next)=>{
    const info = req.query.search;
    const arr=[];
    console.log(info);
    const data = await User.findAll({where:{email:info},attributes:['id','nickName','email','profile']});
    const data2 = await User.findAll({where:{nickName:info},attributes:['id','nickName','email','profile']});
    data.forEach(ele=>{
        arr.push(ele.dataValues);
    });
    data2.forEach(ele=>{
        arr.push(ele.dataValues);
    })
    res.send(arr);
});



module.exports=router;