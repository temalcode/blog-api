//express
const express = require('express');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));
//model
const postModel = require('../models/posts');
//cookie parser
const cookieParser = require('cookie-parser');
router.use(cookieParser());
//middleware
const authenticateUserMiddleware = require('../middleware/authenticateUser');


//GET all posts form all users (homepage)
router.get('/', async function(req, res) {
    try{
        let allPosts = await postModel.find();
        res.status(200).send(allPosts);
    }catch(err){
        res.status(500).send(err.message);
    }
});

//GET a specific post by id
router.get('/:id', async function(req, res){
    try{
        let post = await postModel.findById(req.params.id);
        res.status(200).send(post);
    }catch(err){
        res.status(400).send(err.message);
    }
});

//GET all posts of specific user
router.get('/:username', authenticateUserMiddleware, async function(req, res){
    try{
        let userPosts = await postModel.find({author: req.params.username});
        res.status(200).send(userPosts);
    }catch(err){
        res.status(400).send(err.message);
    }
});

//create a new post
router.post('/create', authenticateUserMiddleware, async function(req, res){
    try{
        let newPost = new postModel({
            title: req.body.title,
            content: req.body.content,
            author: req.author
        });
        let savedPost = await newPost.save();
        res.status(200).send(savedPost);
    }catch(err){
        res.status(500).send(err.message);
    }
})

//update an existing post
router.put('/update/:id', authenticateUserMiddleware, async function(req, res){
    try{
        let updatedPost = await postModel.findOneAndUpdate(
            {
                _id: req.params.id, author: req.author
            }, 
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                new: true,
                runValidators: true
            });

            if(updatedPost == null){
                res.status(400).send('you do not have persmission to edit this post')
            } else{
                res.status(200).send(updatedPost); 
            }
    }catch(err){
        res.status(500).send(err.message);
    }
});

//delete a post
router.delete('/delete/:id', authenticateUserMiddleware, async function(req, res){
    try{
        let deletedPost = await postModel.findOneAndDelete({_id: req.params.id, author:req.author});
        if(deletedPost == null){
            res.status(400).send('you do not have permission to delete this post');
        } else{
            res.status(200).send(deletedPost); 
        }
        
    }catch(err){
        res.status(400).send(err.message);
    }
});


module.exports = router;