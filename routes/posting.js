
const router = require('.');
const multer = require("multer");
const path = require("path");
const {Post,PostMedia} = require("../models");
const { isLoggedIn } = require('./middlewares');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})



router.post("/uploads",isLoggedIn,upload.array("files"), async(req,res)=>{
    const data = await Post.create({
        UserId: req.user.id,
        content: req.body.content    
    });
    console.log(req.files);
    for (let i=0 ; i<req.files.length;i++){
        let type='img';
        if(path.extname(req.files[i].path)=='jpeg'||path.extname(req.files[i].path)=='jpg'||path.extname(req.files[i].path)=='png'||path.extname(req.files[i].path)=='gif'){
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



module.exports = router;