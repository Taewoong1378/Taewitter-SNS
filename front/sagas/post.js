import { all, takeEvery, delay, fork, put } from "redux-saga/effects";
// import axios from 'axios';

// function addPostAPI(data) {
//     return axios.post('/api/post', data);
// }

function* addPost(action) {
    try {
        // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        yield put({
            type: 'ADD_POST_SUCCESS',
            data: action.data
        });
    } catch(err) {
        yield put({
            type: 'ADD_POST_FAILURE',
            data: err.response.data
        });
    }
}

function* watchAddPost() {
    yield takeEvery('ADD_POST_REQUST', addPost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
    ]);
}