const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  const { email, nickName, password, birthday } = req.body;
  console.log(req.body);
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.send({ code: 400 }); // 실패
    }
    const hash = await bcrypt.hash(password, 12);
    console.log(hash, password);
    await User.create({
      email,
      nickName,
      password: hash,
      birthday,
    });
    return res.send({ code: 200 }); //성공
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/join", (req, res) => {
  res.render("signup");
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res.send({ code: 400 });
    }
    if (!user) {
      return res.send({ code: 400 });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return res.send({ code: 400 });
      }
      return res.send({ code: 200 });
    });
  })(req, res, next);
});

//중복체크
router.post("/emailCheck",isLoggedIn, (req, res) => {
  User.findAll({
    where: { email: req.body.email },
  }).then((result) => {
    if (result.length > 0) {
      res.send({ code: 400 });
    } else {
      res.send({ code: 200 });
    }
  });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);
module.exports = router;
