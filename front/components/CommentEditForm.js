import { Avatar, List, Comment } from 'antd';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';
import { REMOVE_COMMENT_REQUEST } from '../reducers/post';
import 'moment-timezone';

const CommentTime = styled.div`
  font-size: 13px;
  margin-right: 10px;
`;

const Commentremove = styled.span`
  font-size: 13px;
`;

const CommentEditForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  const onRemoveComment = useCallback(
    (CommentId) => () => {
      if (!id) {
        return alert('로그인이 필요합니다');
      }
      return dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: {
          id: CommentId,
          PostId: post.id,
        },
      });
    },
    [post.id],
  );

  return (
    <List
      header={`${post.Comments.length}개의 댓글`}
      itemLayout='horizontal'
      dataSource={post.Comments || []}
      renderItem={(item) => (
        <li>
          <Comment
            actions={
              id && item.User.id === id
                ? [
                    <CommentTime>
                      {moment(item.createdAt).format('MM.DD HH:mm')}
                    </CommentTime>,
                    <Commentremove onClick={onRemoveComment(item.id)}>
                      삭제하기
                    </Commentremove>,
                  ]
                : [
                    <CommentTime>
                      {moment(item.createdAt).format('MM.DD HH:mm')}
                    </CommentTime>,
                  ]
            }
            author={item.User.nickname}
            avatar={
              <Link href={`/user/${item.User.id}`} prefetch={false}>
                <a>
                  <Avatar>{item.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            content={item.content}
          />
        </li>
      )}
    />
  );
};

CommentEditForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentEditForm;
