
const express = require("express");
const router = express.Router();
const { User, Post, PostMedia, Follow, HashTag, Like } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
    res.render("explore");
});

router.get("/board", isLoggedIn, async (req, res, next) => {
    const list = [];
    const arr = [];
    const post = await Post.findAll({
        raw: true,
        attributes: ['content', 'createdAt', 'id'],
        where: { id: req.query.id },
        include: [{ model: PostMedia, attributes: ['createdAt', 'type', 'src'] }, { model: User, attributes: ['id', 'nickName', 'profile'] }]
    })

    post.forEach(ele => {
        arr.push(ele);
    });

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

    for (let i = 0; i < list.length; i++) {
        let date = list[i].createdAt;
        let sendDate = date.getFullYear() + '년 ' + (parseInt(date.getMonth()) + 1) + '월 ' + date.getDate() + "일 ";
        if (date.getHours() < 12) {
            sendDate += "오전 " + date.getHours() + "시 ";
        }
        else {
            sendDate += '오후 ' + (parseInt(date.getHours()) - 12) + "시 ";
        }
        sendDate += +date.getMinutes() + "분";

        list[i].createdAt = sendDate;
        delete list[i]['Postmedia.createdAt'];
        delete list[i]['Postmedia.type'];
        delete list[i]['Postmedia.src'];
    }


    const data = await Like.findAll({ where: { UserId: req.user.id, PostId: req.query.id } });
    const cnt = await Like.findAll({ where: { PostId: req.query.id } });
    list[0].likeCount = cnt.length;
    if (data.length != 0) {
        post.like = 'true';
    }

    if (post.length == 0) {
        res.send({ code: 400 });
    }
    else {
        res.send({ data: list[0], code: 200 });
    }
});

//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/list", isLoggedIn, async (req, res, next) => {
    const arr = [];
    const list = [];
    const query = req.query.cnt;
    const tag = '#' + req.query.tag;
    const del = query * 20 - 1;
    const UserList = await User.findAll({
        raw: true,
        attributes: ['id']
    }); // 모든 유저를 찾는 코드
    if (tag == "#no") {
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