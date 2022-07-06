/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Card, Popover, Avatar, Modal, Input } from 'antd';
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment-timezone';

import styled from 'styled-components';
import CommentForm from './CommentForm';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  REVISE_POST_REQUEST,
  REPORT_POST_REQUEST,
} from '../reducers/post';
import CommentEditForm from './CommentEditForm';
import useInput from '../hooks/useInput';

const { TextArea } = Input;

// 한글로 바꿔주기
moment.locale('ko');
moment.tz.setDefault('Asia/Seoul');

const Div = styled.div`
  margin-top: 30px;
  margin-bottom: 20px;
`;

const LikeText = styled.div`
  color: crimson;
  font-size: 14px;
`;

const RetweetDate = styled.div`
  float: right;
`;

const PostDate = styled.div`
  float: right;
`;

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const removePostLoading = useSelector(
    (state) => state.post.removePostLoading,
  );
  const revisePostDone = useSelector((state) => state.post.revisePostDone);

  const reportPostLoading = useSelector(
    (state) => state.post.reportPostLoading,
  );
  const reportPostDone = useSelector((state) => state.post.reportPostDone);
  const reportPostError = useSelector((state) => state.post.reportPostError);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, onChangeReportText] = useInput('');
  const [editMode, setEditMode] = useState(false);
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

  const onClickRevise = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelRevisePost = useCallback(() => {
    setEditMode(false);
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRevisePost = useCallback(
    (editText) => () => {
      dispatch({
        type: REVISE_POST_REQUEST,
        data: {
          PostId: post.id,
          content: editText,
        },
      });
    },
    [post],
  );

  const onSubmitReport = useCallback(() => {
    console.log(id, post.id, reportText);
    dispatch({
      type: REPORT_POST_REQUEST,
      data: {
        postId: post.id,
        content: reportText,
      },
    });
  }, [reportText]);

  const onClickReport = useCallback(() => {
    setModalVisible(true);
  });

  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  useEffect(() => {
    if (reportPostDone) {
      setModalVisible(false);
    }
    if (reportPostError) {
      setModalVisible(false);
    }
  }, [reportPostDone, reportPostError]);

  useEffect(() => {
    if (revisePostDone) {
      onCancelRevisePost();
    }
  }, [revisePostDone]);

  const liked = post.Likers.find((v) => v.id === id);
  return (
    <Div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <LikeText>하트 {post.Likers.length || 0}개</LikeText>,
          liked ? (
            <HeartTwoTone
              twoToneColor='#eb2f96'
              key='heart'
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key='heart' onClick={onLike} />
          ),
          <RetweetOutlined key='retweet' onClick={onRetweet} />,
          <MessageOutlined key='comment' onClick={onToggleComment} />,
          <Popover
            key='more'
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && (
                      <Button onClick={onClickRevise}>수정</Button>
                    )}
                    <Button
                      type='danger'
                      loading={removePostLoading}
                      onClick={onRemovePost}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button onClick={onClickReport} type='danger'>
                    신고
                  </Button>
                )}
              </Button.Group>
            }>
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
        extra={id && <FollowButton post={post} />}>
        <Modal
          title='신고하기'
          visible={modalVisible}
          onOk={onSubmitReport}
          confirmLoading={reportPostLoading}
          onCancel={onCloseModal}>
          <form>
            <TextArea value={reportText} onChange={onChangeReportText} />
          </form>
        </Modal>
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }>
            <RetweetDate>
              {moment(post.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
            </RetweetDate>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  postData={post.Retweet.content}
                  onChangePost={onRevisePost}
                  onCancelRevisePost={onCancelRevisePost}
                />
              }
            />
          </Card>
        ) : (
          <>
            <PostDate>
              {moment(post.createdAt).format('YYYY년 MM월 DD일 HH:mm')}
            </PostDate>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              // editMode는 true면 textarea를 보여주고 false면 기존 게시글을 보여준다.
              description={
                <PostCardContent
                  editMode={editMode}
                  onCancelRevisePost={onCancelRevisePost}
                  postData={post.content}
                  onRevisePost={onRevisePost}
                />
              }
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <CommentEditForm post={post} commentData={post.Comments} />
        </div>
      )}
    </Div>
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
