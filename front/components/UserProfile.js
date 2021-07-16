import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';

const UserProfile = ({ setIsLoggedIn }) => {
    const onLogOut = useCallback(()=> {
        setIsLoggedIn(false);
    }, []);
    return (
        <Card
            actions={[
                <div key="twit">게시글 수<br />0</div>,
                <div key="followings">팔로잉<br />0</div>,
                <div key="followers">팔로워<br />0</div>
            ]}
        >
            <Card.Meta 
                avatar={<Avatar>KTW</Avatar>}
                title="Taewoong"
            />
            <Button onClick={onLogOut}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;