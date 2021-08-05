import React, { useCallback, useMemo } from 'react';
import { Card, Avatar, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user'; 

const UserProfile = () => {
    const style = useMemo(() => ({ marginTop: '30px' }));    
    const dispatch = useDispatch();
    const { me, isLoggingOut } = useSelector((state) => state.user);
    const onLogOut= useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);
    
    return (
        <Card style={style}
            actions={[
                <div key="twit">게시글<br/>0</div>,
                <div key="followgins">팔로잉<br/>0</div>,
                <div key="followers">팔로워<br/>0</div>
            ]}
        >
            <Card.Meta 
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
            <Button onClick={onLogOut} loading={isLoggingOut}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;
