import React, { useCallback, useEffect } from 'react';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const FormStyle = styled(Form)`
  margin-top: 30px;
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  padding: 20px;
`;

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
      <FormStyle>
        <Input.Search
          value={nickname}
          onChange={onChangeNickname}
          addonBefore="닉네임"
          enterButton="수정"
          onSearch={onSubmit}
        />
      </FormStyle>
    );
  };

export default NicknameEditForm;
