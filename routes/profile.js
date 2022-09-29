const multer = require("multer");
const path = require("path");
const axios = require("axios");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares.js");
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { SessionSocketIdMap, User, Follow, Post, PostMedia, BookMark, Like, Comment } = require("../models");

router.get("/test", async (req, res) => {
    res.render('test');
});

// 게시글 불러오기
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

    for (let i = 0; i < list.length; i++) {
        const data = await Like.findAll({ where: { UserId: req.user.id, PostId: list[i].id } });
        const cnt = await Like.findAll({ where: { PostId: list[i].id } });
        list[i].likeCount = cnt.length;
        if (data.length != 0) {
            list[i].like = 'true';
        }
    }
    for (let i = 0; i < list.length; i++) {
        const data = await BookMark.findAll({ where: { UserId: req.user.id, PostId: list[i].id } });
        if (data.length != 0) {
            list[i].bookmark = 'true';
        }
    }

    if (post.length == 0) {
        res.send({ code: 400 });
    }
    else {
        res.send({ data: list[0], code: 200 });
    }
});

// 프로필 라우터
router.get("/", isLoggedIn, async (req, res) => {
    var id;

    // 내 프로필인지 아닌지
    if (req.query.id) {
        id = req.query.id;
        if (req.query.id == req.user.id) {
            isMyprofile = true;

        } else {
            isMyprofile = false;
        }
    } else {
        id = req.user.id;
        isMyprofile = true;
    }

    // 프로필에 나타날 정보 쿼리로 불러옴
    const userinfo = await User.findOne({
        attributes: ['email', 'nickName', 'profile'],
        where: {
            id: id
        }
    })

    const postCnt = await Post.count({
        where: {
            UserId: id
        }
    })
    const bookmarkCnt = await BookMark.count({
        where: {
            UserId: id
        }
    })
    const followingCnt = await Follow.count({
        where: {
            follower: id
        }
    })
    const followerCnt = await Follow.count({
        where: {
            followed: id
        }
    })
    const followCheck = await Follow.count({
        where: {
            follower: req.user.id,
            followed: id
        }
    })

    var data = {
        id: id,
        email: userinfo.email,
        nickName: userinfo.nickName,
        profile: userinfo.profile,
        isMyprofile: isMyprofile,
        posting: postCnt,
        following: followingCnt,
        follower: followerCnt,
        isFollow: followCheck,
        checkBookmark: bookmarkCnt
    }
    res.render('profile', { data });
});

// 팔로우 명단 불러오기
router.get("/getFollowList", async (req, res) => {
    const getFollowingList = await User.findAll({
        raw: true,
        attributes: ['id', 'nickName', 'profile', 'email'],
        include: [{ model: User, as: 'followings', where: { id: req.query.id } }]
    })
    const getFollowerList = await User.findAll({
        raw: true,
        attributes: ['id', 'nickName', 'profile', 'email'],
        include: [{ model: User, as: 'followers', where: { id: req.query.id } }]
    })
    var data = {
        following: getFollowingList,
        follower: getFollowerList
    }
    res.send(data);
})

// 팔로우 처리
router.post("/follow", async (req, res) => {
    const follow = await Follow.create({
        follower: req.user.id,
        followed: req.body.id
    })
    await axios.post("http://localhost:8000/realtime/follow", { sender: req.user.id, receiver: req.body.id });
    res.redirect('/');
})

// 언팔로우 처리
router.post("/unfollow", async (req, res) => {
    const follow = await Follow.destroy({
        where: {
            follower: req.user.id,
            followed: req.body.id
        }
    })
    res.redirect('/');
})

// 개인정보수정 페이지(마이페이지) 렌더링
router.get("/mypage", isLoggedIn, async (req, res) => {
    var data = req.user;
    console.log(data.provider);
    res.render('mypage', { data });
})

// 회원탈퇴
router.post("/deleteUser", isLoggedIn, async (req, res) => {
    const deleteUser = await User.destroy({
        where: { id: req.user.id }
    })
    res.send(true);
})

// 프로필사진 수정
router.post("/mypage/fileupload", isLoggedIn, upload.single("userfile"), async (req, res) => {
    const imgModify = await User.update({
        profile: '/' + req.file.path
    },
        { where: { id: req.user.id } }
    )
    res.send(req.file);
})

// 개인정보수정
router.post("/mypage/update", isLoggedIn, async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 12);
    const profileUpdate = await User.update({
        nickName: req.body.name,
        comment: req.body.comment,
        birthday: req.body.birthday,
        password: hash
    },
        { where: { id: req.user.id } }
    )
    res.send(req.body);
})

router.get("/logout", isLoggedIn, async (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

//게시글 가져 오기
// 모든 유저 게시물 const data = await Post.findAll({raw:true,include:[{model:PostMedia},{model:User,attributes:['nickName','email','profile']}]});
router.get("/post", isLoggedIn, async (req, res, next) => {
    const arr = [];
    const list = [];
    const query = req.query.cnt;
    const id = req.query.id;
    const bookmark = req.query.bookmark;
    const del = query * 20 - 1;
    const UserList = await User.findAll({
        raw: true,
        attributes: ['id']
    }); // 모든 유저를 찾는 코드
    if (bookmark == "no") {
        for (let i = 0; i < UserList.length; i++) {
            const PostAll = await Post.findAll({
                raw: true,
                attributes: ['content', 'createdAt', 'id'],
                where: { UserId: id },
                include: [{ model: PostMedia, attributes: ['createdAt', 'type', 'src'] }, { model: User, attributes: ['id', 'nickName', 'profile'] }]
            })
            PostAll.forEach(ele => {
                arr.push(ele);
            });
        }// arr배열에 쿼리 결과를 담음
    }
    else {
        const bookmarkList = await BookMark.findAll({
            raw: true,
            attributes: ['PostId'],
            where: { UserId: id }
        });

        for (let i = 0; i < bookmarkList.length; i++) {
            const PostAll = await Post.findAll({
                raw: true,
                attributes: ['content', 'createdAt', 'id'],
                where: { id: bookmarkList[i].PostId },
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

    for (let i = 0; i < list.length; i++) {
        const likeCnt = await Like.count({ where: { PostId: list[i].id } });
        const commentCnt = await Comment.count({ where: { PostId: list[i].id } });
        list[i].likeCnt = likeCnt;
        list[i].commentCnt = commentCnt
    }

    console.log("LIST", list);
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
router.post("/bookmark", async (req, res, next) => {
    const data = await BookMark.findAll({ raw: true, where: { UserId: req.user.id, PostId: req.body.postId } });
    console.log(data);
    if (data.length != 0) {
        await BookMark.destroy({ where: { UserId: req.user.id, PostId: req.body.postId } });
        res.send({ code: 300 });
    }
    else {
        await BookMark.create({ UserId: req.user.id, PostId: req.body.postId });
        res.send({ code: 200 });
    }

});
module.exports = router;