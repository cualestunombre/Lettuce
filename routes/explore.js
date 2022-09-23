
const express = require("express");
const router = express.Router();
const { User, Post, PostMedia, Follow, HashTag } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
    res.render("explore");
});


//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/list", isLoggedIn, async (req, res, next) => {
    const arr = [];
    const list = [];
    const query = req.query.cnt;
    const tag = req.query.tag;
    console.log(tag);
    const del = query * 20 - 1;
    const UserList = await User.findAll({
        raw: true,
        attributes: ['id']
    }); // 모든 유저를 찾는 코드
    if (tag == "no") {
        for (let i = 0; i < UserList.length; i++) {
            const PostAll = await Post.findAll({
                raw: true,
                attributes: ['content', 'createdAt', 'id'],
                where: { UserId: UserList[i].id },
                include: [{ model: PostMedia, attributes: ['createdAt', 'type', 'src'] }, { model: User, attributes: ['id', 'nickName', 'profile'] }]
            })
            PostAll.forEach(ele => {
                arr.push(ele);
            });
        }// arr배열에 쿼리 결과를 담음
    }
    else {
        const tagList = await HashTag.findAll({
            raw: true,
            attributes: ['PostId'],
            where: { hashtag: tag }
        });

        for (let i = 0; i < tagList.length; i++) {
            const PostAll = await Post.findAll({
                raw: true,
                attributes: ['content', 'createdAt', 'id'],
                where: { id: tagList[i].PostId },
                include: [{ model: PostMedia, attributes: ['createdAt', 'type', 'src'] }, { model: User, attributes: ['id', 'nickName', 'profile'] }]
            })
            PostAll.forEach(ele => {
                arr.push(ele);
            });
        }// arr배열에 쿼리 결과를 담음
    }
    arr.sort((a, b) => {
        return b['Postmedia.createdAt'] - a['Postmedia.createdAt'];
    }); // 시간순 정렬
    console.log("arr", arr);
    for (let i = 0; i < arr.length; i++) {
        let flag = true;
        for (let j = 0; j < list.length; j++) {
            if (list[j].id == arr[i].id) {
                flag = false;
                break;
            }
        }
        if (flag == false) {
            list[list.length - 1].src.push({ src: arr[i]['Postmedia.src'], type: arr[i]['Postmedia.type'] });
        }
        else {
            list.push(arr[i]);
            list[list.length - 1].src = [{ src: arr[i]['Postmedia.src'], type: arr[i]['Postmedia.type'] }];
        }
    }
    console.log("list1", list);
    for (let i = 0; i < list.length; i++) {
        delete list[i]['Postmedia.createdAt'];
        delete list[i]['Postmedia.type'];
        delete list[i]['Postmedia.src'];
    }
    for (let i = 0; i < del; i++) {
        list.shift();
    }
    while (list.length > 20) {
        list.pop();
    }
    console.log("list2", list);
    // 데이터 가공
    /* 데이터 형식
    {   
        id: ,
        content: , 
        createdAt: ,
        'User.nickName': , 
        'User.profile': ,
        'User.id',
        src: [{src: , type},]
    }

    */
    if (list.length == 0) {
        res.send({ code: 400 });
    }
    else {
        res.send({ data: list, code: 200 });
    }
});


module.exports = router;