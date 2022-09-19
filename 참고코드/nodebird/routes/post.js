const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Hashtag,User} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

try{
    fs.readdirSync('uploads');
}catch(err){
    console.error('uploads folder does not exist. so made a new one'); 
    fs.mkdirSync('uploads');
}
router.delete('/:twiti',isLoggedIn,async(req,res,next)=>{
    try{
        const twit = await Post.findOne({include:{model:User},where:{id:req.params.twiti},}); 
        if (twit.User.dataValues.id==req.user.id){
            const b = await twit.removeHashtags();
            Post.destroy({where:{id:req.params.twiti}});
            res.send(200,'성공적 수행!');
        }
        else{
            throw new Error("인증되지 않았습니다");
        }
        
    }
    catch(err){
        next(err);
    }
});
const upload = multer({
    storage:multer.diskStorage({
        destination(req,file,cb){
            cb(null,'uploads/');
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null,path.basename(file.originalname,ext) + Date.now() + ext);
        }

    }),
    limits:{filesize:5*1024*1024}
});

router.post('/img',isLoggedIn,upload.single('img'),(req,res)=>{
    console.log(req.file);
    res.json({url: `img/${req.file.filename}`}); 
});

const upload2 = multer();
router.post('/',isLoggedIn,upload2.none(),async(req,res,next)=>{
    
    try{
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url, 
            UserId : req.user.id
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if (hashtags){
            const result = await Promise.all(hashtags.map(tag=>{
                return Hashtag.findOrCreate({
                    where:{title:tag.slice(1).toLowerCase()},
                })
            })
            );
            await post.addHashtags(result.map(r=>r[0]));
        }
        res.redirect('/'); 
    }catch(error){
        console.error(error);
        next(error);
    }

});


module.exports =router;

