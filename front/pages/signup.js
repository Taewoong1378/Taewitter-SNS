import React, { useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { From } from 'antd';
import Head from 'next/head';

const Signup = () => {
    const onSubmit = useCallback(() => {

    }, []);

    const onChangeId = useCallback(() => {

    }, []);

    return (
        <>
            <AppLayout>
                <Head>
                    <title>회원가입 | NodeBird</title>
                </Head>
                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-id">아이디</label>
                        <br />
                        <Input name="user-id" value={id} required onChange={onChangeId}/> 
                    </div>
                    <div>
                        <label htmlFor="user-id">닉네임</label>
                        <br />
                        <Input name="user-nick" value={nickname} required onChange={onChangeNickname}/> 
                    </div>
                    <div>
                        <label htmlFor="user-id">비밀번호</label>
                        <br />
                        <Input name="user-password" value={password} required onChange={onChangePassword}/> 
                    </div>
                    <div>
                        <label htmlFor="user-password-check">비밀번호체크</label>
                        <br />
                        <Input
                            name="user-password-check"
                            type="password"
                            value={passwordCheck}
                            required
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                </Form>
            </AppLayout>
        </>
    );
};

export default Signup;