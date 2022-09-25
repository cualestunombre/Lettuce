const express = require("express");
const router = express.Router();
const {Comment,User} = require("../models");

//댓글 등록
router.post("/comments",async(req,res)=>{
    const comments = await Comment.create({
        PostId:req.body.pid,
        UserId:req.user.id,
        comment:req.body.comment
    });
    console.log(comments);
    const come  = await User.findOne({
        attributes:["nickName","profile"],
        where:{id:req.user.id}
    });
    const data = {
        comment:comments.comment,
        nickName: come.nickName,
        profile: come.profile
    }

    res.send(data);
})

//댓글 삭제




//댓글 삭제
router.post("/commentDelete",async(req,res)=>{

})

module.exports = router;