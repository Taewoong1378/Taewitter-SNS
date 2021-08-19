import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';

// index.js, profile.js, signup.js에 모두 들어가는 패키지의 경우에는 각각에 중복해서 넣어주는게 아니라 이렇게 따라 _app.js 파일을 만들어서 넣어준다.

// 즉, _app.js는 pages들의 공통 부분이고, AppLayout.js는 특정 컴포넌트들끼리 공통인 부분

// 만약 body가 아니라 Head를 수정하고 싶다면 next에서 제공하는 Head 컴포넌트를 가져와서 사용하면 된다. 수정하는 Head가 만약 전체에 적용되는거면 _app.js에서, 일부에만 적용되는거라면 AppLayout.js에서 사용하면된다.
const App = ({ Component }) => (
        <>  
            <Head>
                <meta charset="utf-8" />
                <title>SNS Service</title>
            </Head>      
            <Component />  
        </>
);

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
};

// PropTypes는 부모로부터 전달받은 prop의 데이터 type을 검사한다. 자식 컴포넌트에서 명시해 놓은 데이터 타입과 부모로부터 넘겨받은 데이터 타입이 일치하지 않으면 콘솔에 에러 경고문이 띄워진다.

export default wrapper.withRedux(App);
