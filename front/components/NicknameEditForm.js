import React, { useMemo } from 'react';
import { Form, Input } from 'antd';

const NicknameEditForm = () => {
    // styled-components 사용하지 않고 아래와 같이 해도 최적화 가능
    const style = useMemo(() => ({ marginTop: '30px', marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px'}));

    return (
        <Form style={style}>
            <Input.Search addonBefore="닉네임" enterButton="수정" />
        </Form>
    );
};

export default NicknameEditForm;