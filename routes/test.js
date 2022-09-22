const express = require("express");
const router = express.Router();
const {User,Post,PostMedia} = require("../models");
router.get("/",async(req,res,next)=>{
    const data = await Post.findAll({raw:true,where:{UserId:req.user.id}, include:[{model:PostMedia},{model:Post,attributes:['nickName','email','profile']}]});
    res.render("postTest",{data:data});
});

module.exports = router;