const express = require("express");
const router = express.Router();
const {User,Post,PostMedia} = require("../models");
router.get("/",async(req,res,next)=>{
    res.render("postTest");
});
router.get("/users",async(req,res,next)=>{
    const arr=[];
    const query = req.query.cnt;
    const del = query*3 - 1;
        const list = []; 
        const FollowingList = await User.findAll({
         }); // 자기가 팔로우하는 사람을 찾는 코드
        for (let i=0; i<FollowingList.length ;i++){
            const FollowingPost = await Post.findAll({
                raw:true,
                attributes:['content','createdAt','id'],
                where:{UserId: FollowingList[i].id},
                include: [{model:PostMedia,attributes:['createdAt','type','src']},{model:User,attributes:['id','nickName','profile']}]
            })
            FollowingPost.forEach(ele=>{
                arr.push(ele);
            });
        }// arr배열에 쿼리 결과를 담음
        
        arr.sort((a,b)=>{
            return b['Postmedia.createdAt'] - a['Postmedia.createdAt'];
        }); // 시간순 정렬
        for(let i =0;i<arr.length;i++){
            let flag = true;
            for(let j=0;j<list.length;j++){
                if(list[j].id==arr[i].id){
                    flag=false;
                    break;
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
        for(let i=0;i<list.length;i++){
            delete list[i]['Postmedia.createdAt'];
            delete list[i]['Postmedia.type'];
            delete list[i]['Postmedia.src'];
        }
        for (let i =0; i<del; i++){
            list.shift();
        }
        while(list.length>3){
            list.pop();
        }
        // 데이터 가공
        /* 데이터 형식
        {   

            content: , 
            createdAt: ,
            'User.nickName': , 
            'User.profile': ,
            'User.id',
            src: [{src: , type},]
        }

        */

         if(list.length==0){
             res.send({code:400}); 
         }
         else{
            res.send({data:list,code:200});
         }
         
});

module.exports = router;