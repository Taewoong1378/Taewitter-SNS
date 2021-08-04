import { all, fork, call, take, put } from 'redux-saga/effects';
import axios from 'axios';

function logInAPI() {
    return axios.post('/api/login');
}

function* logIn() {
    try {
        const result = yield call(logInAPI);
        yield put({
            type: 'LOG_IN_SUCCESS',
            data: result.data
        });
    } catch(err) {
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data
        });
    }
}

function* watchLogIn() {
    yield take('LOG_IN', logIn);
}

function* watchLogOut() {
    yield take('LOG_OUT');
}

function* watchAddPost() {
    yield take('ADD_POST');
}

export default function* rootSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchAddPost),
    ]);
}

// thunk에서는 비동기 action creator를 직접 실행했지만 saga에서는 action creator가 직접 실행되는게 아니라 이벤트 리스너와 비슷한 느낌을 준다. 어떠한 이벤트가 발생했을 때 정해둔 콜백함수가 실행되는 것처럼 말이다. 