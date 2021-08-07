import React, { useCallback, useMemo } from 'react';
import { Card, Avatar, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user'; 

const UserProfile = () => {
    const style = useMemo(() => ({ marginTop: '30px' }));    
    const dispatch = useDispatch();
    const { me, logOutLoading } = useSelector((state) => state.user);
    const onLogOut= useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);
    
    return (
        <Card style={style}
            actions={[
                <div key="twit">게시글<br/>{me.Posts.length}</div>,
                <div key="followgins">팔로잉<br/>{me.Followings.length}</div>,
                <div key="followers">팔로워<br/>{me.Followers.length}</div>
            ]}
        >
            <Card.Meta 
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
            <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;
