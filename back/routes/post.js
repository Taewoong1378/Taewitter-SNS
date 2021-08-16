const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Image, Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// multer 설정 - 1
const upload = multer({
    // 컴퓨터에 하드디스크에 저장
    // 나중에는 아마존 s3 클라우드에 저장할 것임
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, 'uploads/');
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);    // 확장자 추출
        const basename = path.basename(file.originalname, ext);
        done(null, basename + '_' + Date.now() + ext);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB로 용량 제한
});

router.post('/', isLoggedIn, upload.none(), async (req, res) => {   // POST /post
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
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
    } catch (err) {
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
    } catch (err) {
        console.error(error);
        next(error);
    }
});

// multer 설정 - 2
try {
    fs.accessSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
  
// 사진을 한 장만 올릴거면 upload.single 사용. postForm에 input name="iamge" 부분에 있는 image를 받아온다.
router.post('/images', isLoggedIn,  upload.array('image'), async (req, res, next) => {
    // 이미지 업로드 후에 실행되는 부분
    console.log(req.files); // 업로드된 이미지에 대한 정보
    res.json(req.files.map((v) => v.filename));
});

router.post('/:postId/comment', isLoggedIn, async (req, res) => {   // POST /post/1/comment
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
    } catch (err) {
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

router.delete('/', (req, res) => { 
    res.json({ id: 1});
});

module.exports = router;