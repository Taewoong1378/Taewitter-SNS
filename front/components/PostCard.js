/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Card, Popover, Avatar, List, Comment } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment-timezone';

import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';

// 한글로 바꿔주기
moment.locale('ko');
moment.tz.setDefault('Asia/Seoul');

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me && state.user.me.id);

    const onLike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onUnlike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onRemovePost = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
          type: REMOVE_POST_REQUEST,
          data: post.id,
        });
      }, [id]);

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const liked = post.Likers.find((v) => v.id === id);
    return (
        <div style={{ marginTop: 30, marginBottom: 20 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" onClick={onRetweet} />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
                        : <HeartOutlined key="heart" onClick={onLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover 
                        key="more" 
                        content={(
                        <Button.Group>
                            {id && post.User.id === id 
                            ? (
                                <>
                                    <Button>수정</Button>
                                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                </>
                            ) 
                            : <Button type="danger">신고</Button>}
                        </Button.Group>
                    )}
                    >
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
                extra={<FollowButton post={post} />}
            >
                {post.RetweetId && post.Retweet
                ? (
                    <Card
                    cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
                    >
                        <div style={{ float: 'right' }}>
                            {moment(post.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
                        </div>
                        <Card.Meta 
                            avatar={(
                            <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                                <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                            </Link>
                            )}
                        title={post.Retweet.User.nickname}
                        description={<PostCardContent postData={post.Retweet.content} />}
                        />
                    </Card>
                )
                : (
                    <>
                    <div style={{ float: 'right' }}>
                        {moment(post.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
                    </div>
                    <Card.Meta
                    avatar={<Link href={`/user/${post.User.id}`} prefetch={false}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}
                    />
                    </>
                )}
            </Card>
            {commentFormOpened && (
                <div>
                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    actions={[
                                    <div style={{ fontSize: '13px', marginRight: '10px' }}>
                                        {moment(item.createdAt).format('MM.DD HH:mm')}
                                    </div>,
                                    <span style={{ fontSize: '13px' }}>
                                        수정하기
                                    </span>,
                                    ]}
                                    author={item.User.nickname}
                                    avatar={<Link href={`/user/${item.User.id}`} prefetch={false}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
};

export default PostCard;
