const express = require('express');
const { Post } = require('../models');

const router = express.Router();


router.get('/', async (req, res, next) => {   // GET /posts
    try{
        const posts = await Post.findAll({
            // 지금까지 작성한 모든 게시글을 가져온다.
            limit: 10,  // 10개만 가져와라
            offset: 0, // 1~10 게시글을 가져와라
            // offset: 10 : 11~10 게시글을 가져와라
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;