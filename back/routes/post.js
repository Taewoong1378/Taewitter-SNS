const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { Post, Image, Comment, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// S3 설정
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

// multer 설정 - 1
const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'taewitter',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB로 용량 제한
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {   // POST /post
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            // slice(1)은 해시태그를 떼버리는 것
            // toLowerCase는 대문자로 해시태그를 적으나 소문자로 해시태그를 적으나 똑같이 검색이 가능케하도록 씀
            
            // findOrCreate를 쓰면 해시태그가 없을 때는 등록되고 있을 떄는 가져온다.
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            }))); // [[노드, true], [리액트, true]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {    // 이미지 여러개 업로드
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
                await post.addImages(images);
            } else {    // 이미지 한 개 업로드
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 사진을 한 장만 올릴거면 upload.single 사용. postForm에 input name="iamge" 부분에 있는 image를 받아온다.
router.post('/images', isLoggedIn,  upload.array('image'), async (req, res, next) => {
    // 이미지 업로드 후에 실행되는 부분
    console.log(req.files); // 업로드된 이미지에 대한 정보
    res.json(req.files.map((v) => v.location.replace(/\/original\//, '/thumb/')));
    // S3를 이용하지 않을 때는 v.filename
});


router.get('/:postId', async (req, res, next) => {   // POST /post/1/
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if(!post) {
            return res.status(404).send('존재하지 않는 게시글입니다');   
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }],
        });
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {   // POST /post/1/retweet
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                // post.Retweet 생성
                model: Post,
                as: 'Retweet',
            }],
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');   
        }
        // 게시글을 쓴 사람의 아이디와 로그인한 사람의 아이디가 같은 경우 OR 다른 사람에게 리트윗된 게시글을 쓴 사람의 아이디와 로그인한 사람의 아이디가 같은 경우
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        const retweetTargetId = post.Retweet || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        // 리트윗한 게시글을 또 리트윗하는 경우
        if (exPost) {
            return res.status(403).send('이미 리트윗한 게시글입니다.');
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                attributes: ['id'],
                as: 'Likers',
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }],
        });
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {   // POST /post/1/comment
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');   
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }],
        })
        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.postId }});
        if(!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.postId }});
        if(!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {   // DELETE /post/1
    try {
        await Post.destroy({
            where: {
                id: req.params.postId,
                UserId: req.user.id,
            },
        });
        res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;