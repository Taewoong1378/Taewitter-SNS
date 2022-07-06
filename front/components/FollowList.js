import React, { useMemo } from 'react';
import { List, Button, Card } from 'antd';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const Div = styled.div`
  text-align: center;
  margin: 10px 0;
  margin-bottom: 20px;
`;

const FollowList = ({ header, data, onClickMore, loading }) => {
  const style = useMemo(() => ({ marginBottm: '20px' }), []);
  const listStyle = useMemo(() => ({ marginTop: '20px' }), []);
  const dispatch = useDispatch();
  const onCancel = (id) => () => {
    if (header === '팔로잉 목록') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };
  return (
    <List
      style={style}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size='small'
      header={<div>{header}</div>}
      loadMore={
        <Div>
          <Button onClick={onClickMore} loading={loading}>
            더 보기
          </Button>
        </Div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={listStyle}>
          <Card
            actions={[<StopOutlined key='stop' onClick={onCancel(item.id)} />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
