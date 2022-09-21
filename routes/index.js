const express = require("express");
const router = express.Router();
const {User,Post,PostMedia} = require("../models");



router.get("/",async(req,res) =>{

    if(req.isAuthenticated()){
    //    Post.findAll({
    //     include:[{
    //         model: User,attributes:["id"]
    //         // include:[{
    //         //     model: PostMedia, attributes:["src"]
    //         // }]
    //     }]
        
    //    }).then((result)=>{
    //     console.log(result);
    //     console.log(result[0].dataValues.User);
    //    })
        res.render("main");      
    }
    else{
        res.redirect("/auth/login");
    }
})

module.exports = router;