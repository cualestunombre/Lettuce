const express = require("express");
const router = express.Router();
const {Comment,User} = require("../models");

//댓글 등록
router.post("/comments",async(req,res)=>{ console.log(req.body);
    const comments = await Comment.create({
        PostId:req.body.postId,
        UserId:req.user.id,
        comment:req.body.comment
    });

    res.send({code:200});
})

//댓글 불러오기

router.get("/comments",async(req,res)=>{
    const come  = await Comment.findAll({
        raw:true,
        attributes:["comment","createdAt","id"],
        include:[{model:User, attributes:["nickName","profile","id"]}],
        where:{
                PostId:req.query.PostId},
        order: [['createdAt','DESC']],
        limit:2

    });
    come.forEach(ele=>{
        console.log(ele['User.id']);
        console.log(req.user.id);
        if(ele['User.id']==req.user.id){
            ele.me='true';
        }
    });
    res.send(come);
})




//댓글 삭제
router.post("/commentDelete",async(req,res)=>{
    await Comment.destroy({
        where:{id:req.body.id}
    });
    res.send({code:200});
})

module.exports = router;