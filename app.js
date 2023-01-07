const redis = require("redis");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const port = 8000;
const db = require("./models");
dotenv.config(); //환경 변수용
const redisClient = redis.createClient({url:`redis://${process.env.REDIS_HOST}`,
password:process.env.REDIS_PASSWORD,    legacyMode: true,});
redisClient.connect();
const webSocket = require("./socket.js");
const app = express();
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 10000000000,
  },
  store: new RedisStore({client:redisClient})
});
app.use(sessionMiddleware); // 세션객체 설정

const passport = require("passport"); // js에서 index.js파일은 파일명을 생략할 수 가 있다
const passportConfig = require("./passport");
passportConfig(); //passport 설정
app.use(passport.initialize()); //req에 passport 설정을 심는다
app.use(passport.session()); // req.session에 passport 정보를 저장한다 {express-session과 연동하는 것}
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const postRouter = require("./routes/posting");
const testRouter = require("./routes/test");
const likeRouter = require("./routes/like");
const exploreRouter = require("./routes/explore");
const commentRouter = require("./routes/comment");
const realtimeRouter = require("./routes/realtime");
const chatRouter = require("./routes/chat");
const recommendRouter = require("./routes/recommend");
const { SessionSocketIdMap } = require("./models");
app.set("view engine", "ejs");
app.use(morgan("dev")); // 패킷 정보 공개
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use(express.json()); //json파싱
app.use(express.urlencoded({ extended: false })); //인코딩된 url파싱
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키에 암호 넣고 파싱함

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  }); // DB연결
  app.use((req,res,next)=>{
    console.log(req.user);
    next();
  });
app.use("/", indexRouter); // index router 로 이동
app.use("/auth", authRouter); // auth router 사용
app.use("/profile", profileRouter);
app.use("/user", userRouter);
app.use("/posting", postRouter);
app.use("/test", testRouter);
app.use("/explore", exploreRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);
app.use("/realtime", realtimeRouter);
app.use("/chat", chatRouter);
app.use("/recommend", recommendRouter);
app.get("/socketTest", (req, res) => {
  res.render("socketTest");
});
app.use((req, res, next) => {
  res.render("nonmatch");
});
app.use((err, req, res, next) => {
  console.error(err);
  res.render("error", { error: err });
});
const server = app.listen(port, async () => {
  console.log("Server Port : ", port);
  await SessionSocketIdMap.destroy({ where: {} });
});

webSocket(server, app, sessionMiddleware);
