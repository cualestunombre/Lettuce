const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const port = 8000;
const db = require("./models");
dotenv.config(); //환경 변수용

const app = express();
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000000,
    },
  })
); // 세션객체 설정

const passport = require("passport"); // js에서 index.js파일은 파일명을 생략할 수 가 있다
const passportConfig = require("./passport");
passportConfig(); //passport 설정
app.use(passport.initialize()); //req에 passport 설정을 심는다
app.use(passport.session()); // req.session에 passport 정보를 저장한다 {express-session과 연동하는 것}
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.set("view engine", "ejs");
app.use(morgan("dev")); // 패킷 정보 공개
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use(express.json()); //json파싱
app.use(express.urlencoded({ extended: false })); //인코딩된 url파싱
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키에 암호 넣고 파싱함

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  }); // DB연결

app.use("/", indexRouter); // index router 로 이동
app.use("/auth", authRouter); // auth router 사용

app.use((err, req, res, next) => {
  res.render("error", { error: err.message });
});
app.listen(port, () => {
  console.log("Server Port : ", port);
});
