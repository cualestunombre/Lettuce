const express = require('express'); 
const cookieParser = require('cookie-parser');
const morgan  = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport'); // js에서 index.js파일은 파일명을 생략할 수 가 있다
const {sequelize} = require('./models');
const passportConfig = require('./passport');
dotenv.config();//환경 변수용
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const likeRouter = require('./routes/like');
const app = express();
passportConfig(); //passport 설정
app.set('port',process.env.PORT||8001); 
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});
sequelize.sync({force:false}) // 수정 시 force:true 강제로 지우고 다시 생성 , force:false 무시 ,alter:true 데이터 유지한 채 칼럼 수정 
.then(()=>{
    console.log("데이터 베이스 연결 성공");
})
.catch((err)=>{
    console.error(err);
});
app.use(morgan('dev')); // 패킷 정보 공개
app.use((req,res,next)=>{
    console.log(req.url);
    next();
})
app.use(express.static(path.join(__dirname,'public')));
app.use('/img',(req,res,next)=>{
    console.log(req.url);
    next();
},express.static(path.join(__dirname,'uploads')));
app.use(express.json());//json파싱
app.use(express.urlencoded({extended:false}));//인코딩된 url파싱
app.use(cookieParser(process.env.COOKIE_SECRET));//쿠키에 암호 넣고 파싱함
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }, 
})); // 세션객체 설정
app.use(passport.initialize());//req에 passport 설정을 심는다
app.use(passport.session());// req.session에 passport 정보를 저장한다 {express-session과 연동하는 것}
app.use('/',pageRouter);
app.use('/like',likeRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status= 404;
    next(error);
})

app.use((err,req,res,next)=>{
    res.locals.message = err.message; // 템플릿 엔진에게 에러 메세지 전달
    res.locals.error = process.env.NODE_ENV !=='production' ? err: {}; 
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중'); 
});


