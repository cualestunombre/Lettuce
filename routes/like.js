
const express = require("express");
const router = express.Router();
const {Like,User} = require("../models");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models/index");




//좋아요
router.post("/likes",async(req,res)=>{
    console.log(req.body);
    const likes = await Like.findAll({
        raw: true,
        where:{ PostId:req.body.postId, UserId:req.user.id }
    });
    if(!likes.length==0){
        await Like.destroy({
            where:{PostId:req.body.postId, UserId:req.user.id}
        });
        res.send({code:400})//실패
    }
    else{
        await Like.create(
            {PostId:req.body.postId, UserId:req.user.id}
        );
        res.send({code:200})//성공
    }
})

router.get("/likeCount", async(req,res)=>{

    const likeCount = await Like.findAll({
        raw: true,
        where:{PostId:req.query.PostId}
    });
    console.log(likeCount);
    res.send({Count:likeCount.length});
})


router.get("/list", async(req,res)=>{
    const query = `select users.*,likes.*
    from users inner join likes
    on users.id = likes.UserId
    where likes.PostId = "${req.query.PostId}";`
    const result = await sequelize.query(query,{type:QueryTypes.SELECT});
    console.log(result);
    
    res.send({data:result});
})
module.exports = router;