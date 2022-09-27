const passport = require('passport');
const KakaoStrategy =  require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = ()=>{
    //http://127.0.0.1:8001
    passport.use(new KakaoStrategy({
        clientID:process.env.KAKAO_ID,
        callbackURL:'/auth/kakao/callback'
    },async (accessToken, refreshToken,profile,done)=>{
        console.log('kakao profile',profile);
        try{
            const exUser = await User.findOne({
                where:{email:profile._json.kakao_account.email,provider:'kakao'}
            });
            if (exUser){
                done(null,exUser);c
            }else{
                const newUser= await User.create({
                    email:profile._json.kakao_account.email,
                    nickName:profile._json.properties.nickname,
                    profile:profile._json.properties.profile_image,
                    provider:'kakao'
                });
                done(null,newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
}