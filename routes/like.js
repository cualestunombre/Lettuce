
const express = require("express");
const router = express.Router();
const {Like} = require("../models");

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

module.exports = router;