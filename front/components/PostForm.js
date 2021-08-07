import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
    const { imagePaths, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const [text, onChangeText, setText] = useInput('');
    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);
    const onSubmit = useCallback(() => {
        dispatch(addPost(text));
    }, [text]);
    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);
    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea
                style={{ marginTop: '20px' }}
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="게시하고 싶은 글을 입력해주세요!"
            />
            <div>
                <input type="file" multiple hidden ref={imageInput} />
                <Button style={{ marginTop: '10px' }} onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{ marginTop: '10px', float: 'right' }} htmlType="submit">올리기</Button>
            </div>
            <div>
                {imagePaths.map((v) => (
                    <div key={v} style={{ display: 'inline-block' }}>
                        <img src={v} style={{ width: '200px' }} alt={v} />
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;
