const express = require("express");
const router = express.Router();



router.get("/",(req,res) =>{
    if(req.isAuthenticated()){
        res.render("main");      
    }
    else{
        res.redirect("/auth/login");
    }
})

module.exports = router;