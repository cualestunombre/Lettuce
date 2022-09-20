const multer = require("multer");
const path = require("path");
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})
const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/test", async (req, res) => {
    res.render('test');
});

router.get("/profile", async (req, res) => {
    const userinfo = await User.findOne({
        attributes: ['email', 'nickName', 'profile'],
        where: {
            email: req.query.email
        }
    })
    var data = {
        email: userinfo.email,
        nickName: userinfo.nickName,
        profile: userinfo.profile
    }
    res.render('profile', { data });
});

router.post("/mypage", async (req, res) => {
    var data = req.user;
    res.render('mypage', { data });
})

router.post("/deleteUser", async (req, res) => {
    const deleteUser = await User.destroy({
        where: { id: req.user.id }
    })
    res.send(true);
})

router.post("/mypage/fileupload", upload.single("userfile"), async (req, res) => {
    const imgModify = await User.update({
        profile: req.file.path
    },
        { where: { id: req.user.id } }
    )
    res.send(req.file);
})

router.post("/mypage/update", async (req, res) => {
    const profileUpdate = await User.update({
        nickName: req.body.name,
        comment: req.body.comment,
        birthday: req.body.birthday
    },
        { where: { id: req.user.id } }
    )
    res.send(req.body);
})

// GET /${email} : 해당하는 유저의 개인 페이지로 이동함.
// 본인 페이지 일 경우 css 다르게 처리
// POST /${email}/follow : 이 페이지의 유저를 내가 팔로우 함
// GET /${email}/followers: 이 페이지의 유저의 팔로워 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /${email}/followings: 이 페이지 유저의 팔로잉 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /mypost : 내가 올린 게시글들을 불러옴
// GET /bookmark : 내가 북마크 표시한 게시글들을 불러옴
// POST /mypage : 개인정보 수정 페이지 렌더
module.exports = router;