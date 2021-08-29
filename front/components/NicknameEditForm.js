import React, { useCallback, useEffect } from 'react';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
    const changeNicknameDone = useSelector((state) => state.user.changeNicknameDone);
    const me = useSelector((state) => state.user.me);
    const [nickname, onChangeNickname, setNickname] = useInput(me?.nickname || '');
    const dispatch = useDispatch();
  
    useEffect(() => {
        if (changeNicknameDone) {
            setNickname('');
        }
    }, [changeNicknameDone]);

    const onSubmit = useCallback(() => {
      dispatch({
        type: CHANGE_NICKNAME_REQUEST,
        data: nickname,
      });
    }, [nickname]);
  
    return (
      <Form style={{ marginTop: '30px', marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
        <Input.Search
          value={nickname}
          onChange={onChangeNickname}
          addonBefore="닉네임"
          enterButton="수정"
          onSearch={onSubmit}
        />
      </Form>
    );
  };

export default NicknameEditForm;
