import React, { useCallback, useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../reducers/post';

const PostForm = () => {
    const { imagePaths } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const imageInput = useRef();
    const [text, setText] = useState('');
    const onSubmit = useCallback(() => {
        dispatch(addPost);
        setText('');
    }, []);

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);
    return (
        <Form style={{ margin: '10px 0 20px ' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea 
                style={{marginTop: '30px'}}
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
}

export default PostForm;