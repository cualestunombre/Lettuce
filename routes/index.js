
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia,Follow} = require("../models");




//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const arr=[];
        const list = []; 
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
        for(let i =0;i<arr.length;i++){
            let flag = true;
            for(let j=0;j<list.length;j++){
                if(list[j].id==arr[i].id){
                    flag=false;
                }
            }
            if(flag==false){
                list[list.length-1].src.push({src:arr[i]['Postmedia.src'],type:arr[i]['Postmedia.type']});
            }
            else{
                list.push(arr[i]);
                list[list.length-1].src=[{src:arr[i]['Postmedia.src'],type:arr[i]['Postmedia.type']}];
            }
        }
         res.render('main',{data:list});
          
    }
    else{
        res.redirect("/auth/login");
    }
})


module.exports = router;