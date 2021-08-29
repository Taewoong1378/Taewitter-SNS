import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id);
  const addCommentDone = useSelector((state) => state.post.addCommentDone);
  const addCommentLoading = useSelector((state) => state.post.addCommentLoading);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');
  const FormItem = useMemo(() => ({ position: 'relative', margin: '0' }), []);
  const ButtonStyle = useMemo(() => ({ position: 'absolute', right: '0', bottom: '-40px', zIndex: 1 }), []);

  useEffect(() => {
    if (addCommentDone) {
        setCommentText('');
    }
  }, [addCommentDone]);
  
  const onSubmitComment = useCallback(() => {
    console.log(id, post.id, commentText);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);
  
  return (
      <>
        <Form onFinish={onSubmitComment}>
          <Form.Item style={FormItem}>
            <Input.TextArea 
            rows={4} 
            value={commentText}
            onChange={onChangeCommentText} 
            />
            <Button 
            style={ButtonStyle} 
            type="primary" 
            htmlType="submit"
            loading={addCommentLoading}
            >
              게시
            </Button>
          </Form.Item>
        </Form>
      </>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
