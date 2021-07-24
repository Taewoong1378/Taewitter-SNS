import { createWrapper } from 'next-redux-wrapper'; 
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../reducers';

const configureStore = () => {
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares));
    // 배포용일 때는 devTools를 연결하지 않고 개발용일 때만 devTools를 연결
    const store = createStore(reducer, enhancer);
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: process.env.NODE_ENV === 'development',
    // 이후에 배포할 때 production으로 바꿔주기
});

export default wrapper;
