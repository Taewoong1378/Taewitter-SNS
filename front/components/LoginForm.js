import React, { useCallback } from 'react';
import { Button, Input, Form } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';
import Image from 'next/image'
import naver from '../images/naver.png';
import kakao from '../images/kakao.png';

import useInput from '../hooks/useInput';

const ButtonWrapper = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

const LoginForm = () => {

    const dispatch = useDispatch();
    const { isLoggingIn } = useSelector((state) => state.user);
    // 커스텀훅으로 중복제거
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmitForm = useCallback(() => {
        console.log(id, password);
        dispatch(loginRequestAction({ id, password }));
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
                <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
                <Link href="/auth/naver">
                    <a>
                        <Image width={180} height={38} src={naver} />
                    </a>
                </Link><br/>
                <Link href="/auth/kakao">
                    <a>
                        <Image width={180} height={38} src={kakao} />
                    </a>
                </Link><br/>
        </FormWrapper>
    );
}


export default LoginForm;
