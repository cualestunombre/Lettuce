const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
module.exports = () =>{
    passport.use(new localStrategy({
        usernameField:'email',
        passwordField:'password',
    }, async (email, password, done)=>{
        try{
            const exUser = await User.findOne({where:{email}});
            if (exUser){
                const result = exUser.password == password;
                if(result){
                    done(null, exUser);
                }else{
                    done(null,false,{message: '비밀번호가 일치하지 않습니다'});
                }
            }else{
                done(null,false,{message:'가입되지 않은 회원 입니다'});
            }
        }catch(error){
            console.error(error);
            done(err);
        }
    }
        
    ));
};