const express = require('express');
const { Op } = require('sequelize');
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();


router.get('/', async (req, res, next) => {   // GET /posts
    try{
        const where = {};
        // 쿼리스트링을 통해 lastId 데이터를 전달해줬으니 req.query 안에 lastId 값이 들어있다.
        if (parseInt(req.query.lastId, 10)) {   // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)};
            // id가 lastId보다 작은거 10개 불러오기
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attriutes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;