import { Button, Input, Avatar, List, Comment } from 'antd';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { REMOVE_COMMENT_REQUEST, REVISE_COMMENT_REQUEST } from '../reducers/post';
import 'moment-timezone';

const { TextArea } = Input;
const CommentEditForm = ({ post }) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const [editText, setEditText] = useState('');
    const [commentEditMode, setCommentEditMode] = useState(false);
    const onReviseCommentText = useCallback((e) => {
      setEditText(e.target.value);
    });
    const { reviseCommentLoading } = useSelector((state) => state.post);

    const onReviseComment = useCallback(() => {
        dispatch({
            type: REVISE_COMMENT_REQUEST,
            data: {
                content: editText,
                PostId: post.id,
                UserId: id,
            },
        });
    }, [editText, id]);

    const onRemoveComment = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
          type: REMOVE_COMMENT_REQUEST,
          data: {
            PostId: post.id,
            UserId: id,
          },
        });
    }, [id]);

    const onClickReviseComment = useCallback(() => {
        setCommentEditMode(true);
    });

    const onCancelReviseComment = useCallback(() => {
        setCommentEditMode(false);
    }, []);

    return (
        <div>
          {commentEditMode
          ? (
            <>
              <TextArea value={editText} onChange={onReviseCommentText} />
              <Button.Group>
                <Button loading={reviseCommentLoading} onClick={onReviseComment}>수정</Button>
                <Button type="danger" onClick={onCancelReviseComment}>취소</Button>
              </Button.Group>        
            </>
          )
          : (
            <List
            // header={`${post.Comments.length}개의 댓글`}
            header="0개의 댓글"
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={(item) => (
                <li>
                    <Comment
                        actions={[
                        <div style={{ fontSize: '13px', marginRight: '10px' }}>
                            {moment(item.createdAt).format('MM.DD HH:mm')}
                        </div>,
                        <span style={{ fontSize: '13px' }} onClick={onClickReviseComment}>
                            수정하기
                        </span>,
                        <span style={{ fontSize: '13px' }} onClick={onRemoveComment}>
                            삭제하기
                        </span>,
                        ]}
                        author={item.User.nickname}
                        avatar={<Link href={`/user/${item.User.id}`} prefetch={false}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                        content={item.content}
                    />
                </li>
            )}
            />
            )}
        </div>
    );
};

CommentEditForm.propTypes = {
    post: PropTypes.object.isRequired,
};
  
export default CommentEditForm;
