import React, { useCallback } from 'react';
import { Button, Input, Form } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loginAction } from '../reducers/user';

import useInput from '../hooks/useInput';

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

const LoginForm = () => {

    const dispatch = useDispatch();
    // 커스텀훅으로 중복제거
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmitForm = useCallback(() => {
        console.log(id, password);
        dispatch(loginAction({ id, password }));
    }, [id, password]);

    return (
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br />
                <Input 
                name="user-id" 
                value={id} 
                onChange={onChangeId} 
                required
                style={{ width: '80%', marginBottom: 15 }} 
                />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input 
                name="user-password"
                type="password" 
                value={password} 
                onChange={onChangePassword} 
                required
                style={{ width: '80%' }}
                />
            </div>
            <ButtonWrapper>
                <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
                <Link href="/auth/naver">
                    <a>
                        <img width={180} height={38} style={{ marginTop: '20px', boxSizing: 'border-box'}} src="https://lh3.googleusercontent.com/proxy/lNNECt0rdFqa-NvLmu2xvoAimYKtsSCQKd2n70ROHmmkHCjqqlZEe73m0Zbuk5yBVKhOiak0QElnVEET5s0lB5b8VsClIurdbw6AE48to5gx9tc" />
                    </a>
                </Link><br/>
                <Link href="/auth/kakao">
                    <a>
                        <img width={180} height={38} style={{ marginTop: '10px'}} src="https://www.gb.go.kr/Main/Images/ko/member/certi_kakao_login.png" />
                    </a>
                </Link><br/>
        </FormWrapper>
    );
}


export default LoginForm;
