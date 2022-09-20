exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        next(new Error("로그인이 필요합니다"));
    }
}
exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }
    else{
        next(new Error("이미 로그인 한 상태입니다"));
    }
}