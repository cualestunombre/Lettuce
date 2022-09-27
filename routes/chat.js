const express = require("express");
const router = express.Router();
const {Follow,User} = require("../models");
const {isLoggedIn, isNotLoggedIn} = require("./middlewares");
router.get("/",isLoggedIn,async(req,res,next)=>{
    const data = await User.findAll({raw:true,include:[{model:User,as:"followings",attributes:['id','email','nickName','profile','comment'],where:{id:req.user.id}}]});
    console.log(data);
    
    res.render("chat",{data:data});
});


module.exports = router;
