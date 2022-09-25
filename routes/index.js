
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia,Follow,Comment,Like} = require("../models");
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const arr=[];
        const data = await Follow.findAll({raw:true,where:{follower:req.user.id}});
        data.push({id:req.user.id});
        for (let i=0;i<data.length;i++){
            const Posts = await Post.findAll({raw:true, where:{UserId:data[i].id}});
            Posts.forEach(ele=>{
                arr.push(ele);
            });
        }
        
        if(arr.length==0){
            res.render('main',{code:400});
        }
        else{
            res.render('main',{code:200});
        }
    }
    else{
        res.redirect("/auth/login");
    }
});




router.get("/fpost",async(req,res)=>{
    const arr=[];
    const list = []; 
    const offset = req.query.cnt*5-1;
    const FollowingList = await User.findAll({
        raw: true,
        attributes: ['id'],
        include: [{ model: User, as: 'followings', where: { id: req.user.id } }]})

    FollowingList.push({id:req.user.id});
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
        let date = list[i].createdAt;
        let sendDate = date.getFullYear()+'년 '+(parseInt(date.getMonth())+1)+'월 '+date.getDate()+"일 ";         
        if(date.getHours()<12){
            sendDate+="오전 "+date.getHours()+"시 ";
        }
        else{
            sendDate+='오후 '+(parseInt(date.getHours())-12)+"시 ";
        }
        sendDate+=+date.getMinutes()+"분";
        
        list[i].createdAt=sendDate;
        delete list[i]['Postmedia.createdAt'];
        delete list[i]['Postmedia.type'];
        delete list[i]['Postmedia.src'];
    }
    for (let i=0;i<=offset;i++){
        list.shift();
    }
    while(list.length>5){
        list.pop();
    }
    for(let i=0;i<list.length;i++){
        const data = await Like.findAll({where:{UserId:req.user.id,PostId:list[i].id}});
        const cnt = await Like.findAll({where:{PostId:list[i].id}});
        list[i].likeCount= cnt.length;
        if(data.length!=0){
            list[i].like='true';
        }
    }
    if (list.length==0){
        res.send({code:400});
    }
    else{
        res.send({code:200,data:list});
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
});




module.exports = router;