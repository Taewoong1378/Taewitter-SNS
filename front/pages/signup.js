import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Head from 'next/head';
import { Form, Input, Checkbox, Button, Popover } from 'antd';
import styled from 'styled-components';
import AppLayout from '../components/AppLayout';

import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST } from '../reducers/user';

const ErrorMessage = styled.div`
    color: red;        
`;

const Signup = () => {
    const dispatch = useDispatch();
    const { signUpDone, signUpLoading, signUpError, me } = useSelector((state) => state.user);

    useEffect(() => {
        if ((me && me.id)) {
            Router.replace('/');
        }
    }, [me && me.id]);
    
    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);
    
    useEffect(() => {
        if (signUpDone) {
            alert('회원가입을 완료했으니 메인페이지로 이동합니다.');
            Router.replace('/');
        }
    }, [signUpDone]);

    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [nickname, onChangeNickname] = useInput('');

    // 비밀번호 체크는 조금 다른 부분이 있음
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);
    
    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
          return setPasswordError(true);
        }
        if (!term) {
          return setTermError(true);
        }
        return dispatch({
          type: SIGN_UP_REQUEST,
          data: {
            email,
            password,
            nickname,
          },
        });
      }, [email, password, passwordCheck, term]);
    
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);   // 여기까지였으면 커스텀 훅으로 줄일 수 있었다.
        setPasswordError(e.target.value !== password);
        // 비밀번호와 비밀번호 확인이 일치하는지 확인한다.
        // 둘이 일치하지 않으면 passwordError가 true가 되고
        // 둘이 일치하면 passwordError가 false가 된다.
        // 따라서 passwordError가 true가 되면 에러를 표시해주면 된다.
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, []);
    
    const content = '강태웅과 오래오래 잘 지낸다!';
    return (
        <AppLayout>
            <Head>
                <title>회원가입 | Nodebird</title>
            </Head>
            <Form
                style={{ width: 400, margin: 'auto', marginTop: 10 }} 
                onFinish={onSubmit}
            >
                <div>
                    <label htmlFor="user-email">아이디</label>
                    <br />
                    <Input 
                        name="user-email" 
                        type="email"
                        value={email} 
                        required 
                        onChange={onChangeEmail}
                        style={{ marginBottom: 20 }}
                    />
                </div>
                <div>
                    <label htmlFor="user-nickname">닉네임</label>
                    <br />
                    <Input 
                        name="user-nickname" 
                        value={nickname} 
                        required 
                        onChange={onChangeNickname}
                        style={{ marginBottom: 20 }}
                    />
                </div>
                <div>
                    <label htmlFor="user-password">비밀번호</label>
                    <br />
                    <Input 
                        name="user-password" 
                        type="password"
                        value={password} 
                        required 
                        onChange={onChangePassword}
                        style={{ marginBottom: 20 }}
                    />
                </div>
                <div>
                    <label htmlFor="user-password-check">비밀번호 체크</label>
                    <br />
                    <Input 
                        name="user-password-check" 
                        type="password"
                        value={passwordCheck} 
                        required 
                        onChange={onChangePasswordCheck}
                    />
                    {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
                </div>
                <div
                    style={{ marginTop: 15 }}
                >
                    <Checkbox 
                        name="user-term" 
                        checked={term} 
                        onChange={onChangeTerm}
                    >
                        다음 <Popover content={content}><span style={{ color: 'red', fontWeight: 'bold' }}>항목</span></Popover>들에 대해 동의합니다.
                    </Checkbox>
                    {termError && <ErrorMessage>약관에 동의하셔야합니다.</ErrorMessage>}
                </div>
                <div style={{ marginTop: 10 }}>
                    <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
                </div>
            </Form>
        </AppLayout>
    );
};

export default Signup;
