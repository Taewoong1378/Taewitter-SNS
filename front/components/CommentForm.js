import { Button, Form, Input } from 'antd';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';
import { useSelector } from 'react-redux';

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const [commentText, onChangeCommentText] = useInput('');

  const onSubmitComment = useCallback(() => {
    console.log(id, post.id, commentText);
  }, [commentText]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea 
        rows={4} 
        value={commentText} 
        onChange={onChangeCommentText} 
        />
        <Button 
        style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }} 
        type="primary" 
        htmlType="submit"
        >
          게시
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
