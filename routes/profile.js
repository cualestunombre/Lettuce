const multer = require("multer");
const path = require("path");
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
const { User, Follow, Post, PostMedia } = require("../models");

router.get("/test", async (req, res) => {
    res.render('test');
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
        following: followingCnt,
        follower: followerCnt,
        isFollow: followCheck
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
router.post("/mypage", isLoggedIn, async (req, res) => {
    var data = req.user;
    console.log(data);
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
    console.log(req.file.path);
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

router.get("/inpost", async (req, res) => {
    const data = await Post.findAll({ raw: true, where: { UserId: req.user.id }, include: [{ model: PostMedia }, { model: User, attributes: ['nickName', 'email', 'profile'] }] });
    console.log(data);
    res.send(data);
})

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});
// GET /${email} : 해당하는 유저의 개인 페이지로 이동함.
// 본인 페이지 일 경우 css 다르게 처리
// POST /${email}/follow : 이 페이지의 유저를 내가 팔로우 함
// GET /${email}/followers: 이 페이지의 유저의 팔로워 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /${email}/followings: 이 페이지 유저의 팔로잉 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /mypost : 내가 올린 게시글들을 불러옴
// GET /bookmark : 내가 북마크 표시한 게시글들을 불러옴
// POST /mypage : 개인정보 수정 페이지 렌더
module.exports = router;