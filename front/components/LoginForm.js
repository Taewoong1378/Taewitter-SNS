import React, {useState, useCallback} from 'react';
import { Input, Form, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

// div태그를 사용하면서 margin-top: 10px이 적용된 styled-compoents를 생성하는 법이다.
const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const LoginForm = () => {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const onChangeId = useCallback((e)=> {
        setId(e.target.value);
    }, []);

    const onChangePassword = useCallback((e)=> {
        setPassword(e.target.value);
    }, []);

    return (
        <Form>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br />
                <Input name="user-id" value={id} onChange={onChangeId} required />
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
                />
            </div>
            {/* 아래와 같이 해버리면 {} !== {}이기 때문에 리랜더링 될때마다 Button이 다시 생성되는 문제가 발생한다. */}
            {/* <div style={{ marginTop: '10px' }}></div> */}
                <ButtonWrapper>
                    <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                    <Link href="/signup"><a><Button>회원가입</Button></a></Link>
                </ButtonWrapper>
        </Form>
    );
}

export default LoginForm;