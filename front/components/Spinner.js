import React from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

const Spinner = () => {
    const kakaoLoginLoading = useSelector((state) => state.user.kakaoLoginLoading);
    return (
        <>
            <Button type="primary" loading={kakaoLoginLoading}>
                Loading
            </Button>
        </>
    );
};

export default Spinner;
