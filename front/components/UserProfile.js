import React, { useCallback, useMemo } from 'react';
import { Card, Avatar, Button } from 'antd';

import { useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user'; 

const UserProfile = () => {
    const style = useMemo(() => ({ marginTop: '30px' }));    
    const dispatch = useDispatch();
    const onLogOut= useCallback(() => {
        dispatch(logoutAction());
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
                avatar={<Avatar>KTW</Avatar>}
                title="강태웅"
            />
            <Button onClick={onLogOut}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;
