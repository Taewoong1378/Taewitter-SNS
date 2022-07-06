import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Button } from 'antd';

import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const style = useMemo(() => ({ marginTop: '30px' }));
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.me);
  const logOutLoading = useSelector((state) => state.user.logOutLoading);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <div style={{ paddingLeft: '4px' }}>
      <Card
        style={style}
        actions={[
          <div key='twit'>
            <Link href={`/user/${me.id}`}>
              <a>
                게시글
                <br />
                {me.Posts.length}
              </a>
            </Link>
          </div>,
          <div key='followings'>
            <Link href='/profile'>
              <a>
                팔로잉
                <br />
                {me.Followings.length}
              </a>
            </Link>
          </div>,
          <div key='followings'>
            <Link href='/profile'>
              <a>
                팔로워
                <br />
                {me.Followers.length}
              </a>
            </Link>
          </div>,
        ]}>
        <Card.Meta
          avatar={
            <Link href={`/user/${me.id}`} prefetch={false}>
              <a>
                <Avatar>{me.nickname[0]}</Avatar>
              </a>
            </Link>
          }
          title={me.nickname}
        />
        <Button onClick={onLogOut} loading={logOutLoading}>
          로그아웃
        </Button>
      </Card>
    </div>
  );
};

export default UserProfile;
