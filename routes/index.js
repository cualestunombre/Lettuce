const { application } = require("express");
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia} = require("../models");




//게시글 가져 오기
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
        console.log(data);
        res.render("main",{data:data});  
    }
    else{
        res.redirect("/auth/login");
    }
})


module.exports = router;