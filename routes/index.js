const { application } = require("express");
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia,Follow} = require("../models");




//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const arr=[];
        const FollowingList = await User.findAll({
            raw: true,
            attributes: ['id'],
            include: [{ model: User, as: 'followings', where: { id: req.user.id } }]
        })
        for (let i=0; i<FollowingList.length ;i++){
            const FollowingPost = await Post.findAll({
                raw:true,
                include: [{model:PostMedia},{model:User,attributes:['nickName','profile']}]
            })
            FollowingPost.forEach(ele=>{
                arr.push(ele);
            });
        }arr.sort((a,b)=>{
            return a['Postmedia.createdAt'] -b['Postmedia.createdAt'];
        })

         console.log(arr);
          
    }
    else{
        res.redirect("/auth/login");
    }
})


module.exports = router;