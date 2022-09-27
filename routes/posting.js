
const router = require('.');
const multer = require("multer");
const path = require("path");
const {Post,PostMedia,HashTag} = require("../models");
const { isLoggedIn } = require('./middlewares');
const {v4:uuidv4}=require('uuid');
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, uuidv4() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})



router.post("/uploads",isLoggedIn,upload.array("files"), async(req,res)=>{
    const data = await Post.create({
        UserId: req.user.id,
        content: req.body.content    
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if(hashtags){
        for (let i=0;i<hashtags.length;i++){
            await HashTag.create({hashtag:hashtags[i],PostId:data.dataValues.id});
        }
    }

    for (let i=0 ; i<req.files.length;i++){
        let type='img';
        if(path.extname(req.files[i].path)=='.jpeg'||path.extname(req.files[i].path)=='.jpg'||path.extname(req.files[i].path)=='.png'||path.extname(req.files[i].path)=='.gif'){
            type='img';
        }
        else{
            type="video";
        }
        await PostMedia.create({
            PostId: data.dataValues.id,
            src: '/'+req.files[i].path,
            type:type
        });
    }
   

    res.send({code:200});
})

router.delete("/post",async (req,res,next)=>{
    await Post.destroy({where:{id:req.query.id}});
    res.send({code:200});
});


module.exports = router;