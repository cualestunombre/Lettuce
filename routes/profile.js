const multer = require("multer");
const path = require("path");
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname) + ext);
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
    console.log(userinfo);
    var data = {
        email: userinfo.email,
        nickName: userinfo.nickName,
        profile: userinfo.profile
    }
    console.log(data);
    res.render('profile', { data });
});

router.post("/mypage", async (req, res) => {
    var data = req.user;
    res.render('mypage', { data });
})

router.post("/upload", upload.single("userfile"), (req, res) => {
    res.send(req.file);
})
// router.post("/write", visitor.post_comment);
// router.get("/get", visitor.get_visitor);
// router.patch("/edit", visitor.patch_comment);   // post와 같은 기능
// router.delete("/delete", visitor.delete_comment);   // post와 같은 기능

// GET /${email} : 해당하는 유저의 개인 페이지로 이동함.
// 본인 페이지 일 경우 css 다르게 처리
// POST /${email}/follow : 이 페이지의 유저를 내가 팔로우 함
// GET /${email}/followers: 이 페이지의 유저의 팔로워 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /${email}/followings: 이 페이지 유저의 팔로잉 정보를 JSON으로 받음->modal창으로 열기 위함
// GET /mypost : 내가 올린 게시글들을 불러옴
// GET /bookmark : 내가 북마크 표시한 게시글들을 불러옴
// POST /mypage : 개인정보 수정 페이지 렌더
module.exports = router;



/* cotnroller */

// exports.post_comment = (req, res) => {
//     console.log(req.body);

//     Visitor.insert(req.body.name, req.body.comment, function (result) {
//         res.send({ id: result });
//     });
// }

// exports.get_visitor = (req, res) => {
//     Visitor.get_visitor(req.query.id, function (result) {
//         console.log("result : ", result);
//         res.send({ result: result[0] });
//     })
// }

// exports.patch_comment = (req, res) => {
//     Visitor.update(req.body, function (result) {
//         console.log(result);
//         res.send("수정 성공");
//     });
// }

// exports.delete_comment = (req, res) => {
//     Visitor.delete(req.body.id, function (result) {
//         console.log(result);
//         res.send("삭제 성공");
//     });
// }