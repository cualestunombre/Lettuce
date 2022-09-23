
const express = require("express");
const router = express.Router();
const {User,Post,PostMedia,Follow} = require("../models");
router.get("/",async(req,res) =>{
    if(req.isAuthenticated()){
        const data = await Follow.findAll({raw:true,where:{follower:req.user.id}});
        if(data.length==0){
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
        include: [{ model: User, as: 'followings', where: { id: req.user.id } }]
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
        let date = list[i].createdAt;
        let sendDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();         
        if(String(date.getHours()).length==1){
            sendDate+='  '+'0'+date.getHours();
        }
        else{
            sendDate+='  '+date.getHours();
        }
        if(String(date.getMinutes()).length==1){
            sendDate+=':'+'0'+date.getMinutes();
        }
        else{
            sendDate+=":"+date.getMinutes();
        }
        list[i].createdAt=sendDate;
        delete list[i]['Postmedia.createdAt'];
        delete list[i]['Postmedia.type'];
        delete list[i]['Postmedia.src'];
    }
    for (let i=0;i<offset;i++){
        list.shift();
    }
    while(list.length>5){
        list.pop();
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