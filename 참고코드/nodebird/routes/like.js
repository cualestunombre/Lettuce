const express = require('express');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares');
const {Post,User} = require('../models');
const router = express.Router();

router.get('/:pid',async(req,res,next)=>{
    try{
        const post = await Post.findOne({where:{id:req.params.pid}});
        const numOfUsers = await post.getUsers();
        const data = {count:numOfUsers.length, check:false} ;
        console.log(numOfUsers);

        if (req.user){
            numOfUsers.forEach(element => {
                if(element.dataValues.id==req.user.id){
                    data.check=true;
                }
                
            });
        }
        res.json(200,data);
    }
    catch(err){
        next(err);
    }
});
router.delete('/:pid',isLoggedIn,async(req,res,next)=>{
    try{
        if (!req.user){
            return res.send({check:false});
        }
        const post = await Post.findOne({where:{id:req.params.pid}});
        await post.removeUser(parseInt(req.user.id));
        res.send(200,{check:true});
    }
    catch(err){
        console.error(err);
    }
});
router.post('/:pid',async(req,res,next)=>{
    try{
        if (!req.user){
            return res.send({check:false});
        }
        const post = await Post.findOne({where:{id:req.params.pid}});
        await post.addUser(parseInt(req.user.id));
        res.send(201,{check:true});
    }catch(err){
        console.error(err);
    }
});



















module.exports = router; 