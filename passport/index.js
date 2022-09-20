const passport =require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
module.exports = () =>{
    passport.serializeUser((user,done)=>{
        done(null,user.id); 
    }); //첫 로그인 시, 실행되고, req.session객체에 무엇을 넣을지 결정함
    passport.deserializeUser ((id,done)=>{ 
        User.findOne( {where: {id:id}}
        ).then(user=>done(null,user)).catch(err=>done(err)); 
        //매 요청 시에 실행되고, req.user에 user객체를 저장함 
    });
    local();
    
};


