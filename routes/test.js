const { application } = require("express");
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia} = require("../models");
router.get("/",async(req,res,next)=>{
    const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
    console.log(data);
    res.render("postTest",{data:data});
});

module.exports = router;