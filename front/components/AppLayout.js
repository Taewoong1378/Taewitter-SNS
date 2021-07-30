import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

const AppLayout = ({ children }) => {
    // 서버쪽이 없다는 가정하에 더미 데이터로 로그인 구현하기
    const style = useMemo(() => ({ fontSize: '15px', fontWeight: 'bold', marginTop: '28px', textAlign: 'center' }));
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    return (
        <div>
            <div>
                <Menu mode="horizontal">
                    <Menu.Item>
                        <Link href="/"><a>메인 페이지</a></Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/profile"><a>내 프로필</a></Link>
                    </Menu.Item>
                    <Menu.Item>
                        <SearchInput enterButton />
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/signup"><a>회원가입</a></Link>
                    </Menu.Item>
                </Menu>
                {/* 모바일에서는 xs, 테블릿에서는 md */}
                {/* 총 24개의 컬럼으로 구성돼있는데 xs={24}를 하면 24개의 칼럼, 즉 100%를 다 차지하겠다는 말이다 */}
                {/* 화면이 커지면 6/24 = 25%, 12/24 = 50%, 6/24 = 25%를 각각 차지하겠다는 말이다 */}
                {/* gutter는 컬럼들이 너무 서로 붙어있으면 쫌 그렇기 때문에 컬럼 사이에 간격을 주는 것이다. */}
                {/* target="blank"만 사용하면 보안위협이 있기 때문에 반드시 rel="noreferrer noopener"를 같이 써준다 */}
                <Row gutter={8}>
                    <Col xs={24} md={6}>
                        {isLoggedIn ? <UserProfile /> : <LoginForm />}
                    </Col>
                    <Col xs={24} md={12}>
                        {children}
                    </Col>
                    <Col style={style} xs={24} md={6}>
                        <a href="https://github.com/Taewoong1378" target="_blank" rel="noreferrer noopener">Made by Taewoong</a>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;