import React, { useCallback, useEffect } from 'react';
import { Button, Input, Form } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { KAKAO_LOGIN_REQUEST, loginRequestAction } from '../reducers/user';
import naver from '../public/naver.png';
import kakao from '../public/kakao.png';

import useInput from '../hooks/useInput';
import { backUrl, KAKAO_AUTH_URL } from '../config/config';

const ButtonWrapper = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
`;

const FormWrapper = styled(Form)`
    padding: 10px;
`;

const LoginForm = () => {
    const dispatch = useDispatch();
    const logInLoading = useSelector((state) => state.user.logInLoading);
    const logInError = useSelector((state) => state.user.logInError);
    const code = new URL(window.location.href).searchParams.get('code');
    // 커스텀훅으로 중복제거
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    useEffect(() => {
        if (logInError) {
            alert(logInError);
        }
    }, [logInError]);

    const onSubmitForm = useCallback(() => {
        dispatch(loginRequestAction({ email, password }));
    }, [email, password]);

    const onClickKaKao = useCallback(() => {
        dispatch({
            type: KAKAO_LOGIN_REQUEST,
            data: code,
        });
    });

    return (
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input
                name="user-email"
                type="email"
                value={email}
                onChange={onChangeEmail}
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
                <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
                <Link href={`${backUrl}/user/naver`}>
                    <a>
                        <Image width={180} height={38} src={naver} />
                    </a>
                </Link><br />
                <Link href={KAKAO_AUTH_URL} onClick={onClickKaKao}>
                    <a>
                        <Image width={180} height={38} src={kakao} />
                    </a>
                </Link><br />
        </FormWrapper>
    );
};

export default LoginForm;
