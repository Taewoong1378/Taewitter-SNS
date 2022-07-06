import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from '../reducers/post';
import useInput from '../hooks/useInput';

const Formstyle = styled(Form)`
  margin: 10px 0 20px;
`;

const ButtonStyle = styled(Button)`
  margin-top: 10px;
`;

const ButtonStyle2 = styled(Button)`
  margin-top: 10px;
  float: right;
`;

const PostForm = () => {
  const imagePaths = useSelector((state) => state.post.imagePaths);
  const addPostDone = useSelector((state) => state.post.addPostDone);
  const inputStyle = useMemo(() => ({ marginTop: '20px' }), []);
  const divStyle = useMemo(() => ({ display: 'inline-block' }), []);
  const imageWidth = useMemo(() => ({ width: '200px' }), []);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');
  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      // req.body.image
      formData.append('image', p);
    });
    // req.body.content
    formData.append('content', text);
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      // 여기의 'image'는 PoST /post/images의 key값과 같아야한다.
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  // 고차함수 이용
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });
  return (
    <Formstyle encType='multipart/form-data' onFinish={onSubmit}>
      <Input.TextArea
        style={inputStyle}
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder='게시하고 싶은 글을 입력해주세요!'
      />
      <div>
        <input
          type='file'
          name='image'
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <ButtonStyle onClick={onClickImageUpload}>이미지 업로드</ButtonStyle>
        <ButtonStyle2 type='primary' htmlType='submit'>
          올리기
        </ButtonStyle2>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={divStyle}>
            <img
              src={v.replace(/\/thumb\//, '/original/')}
              style={imageWidth}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Formstyle>
  );
};

export default PostForm;
