
const router = require('.');
const multer = require("multer");
const path = require("path");
const {Post,PostMedia} = require("../models");

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



router.post("/uploads",upload.single("postFile"), async(req,res)=>{
    const postCreat = await Post.create({
        UserId: req.user.id,
        content: req.body.content    
    })
    console.log(postCreat);
    console.log(req.file.path);
    const postMeidaCreat = await PostMedia.create({
        
        PostId: postCreat.dataValues.id,
        src: req.file.path,
        type: "img"
    })

    res.send({code:200});
})



module.exports = router;