import { createWrapper } from 'next-redux-wrapper'; 

const configureStore = () => {
    const store = createStore(reducer);
    return store;
};

const wrapper = createWrapper(configureStore, {
    debug: process.env.NODE_ENV === 'development',
    // 이후에 배포할 때 production으로 바꿔주기
});

export default wrapper;