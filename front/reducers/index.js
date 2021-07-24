import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    user: {
        isLoggedIn: false,
        user: null,
        signUpData: {},
        loginData: {},
    },
    post: {
        mainPosts: [],
    }
};

// 동적으로 액션을 생성하는 action creator
export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data,
    }
}

export const logoutAction = () => {
    return {
        type: 'LOG_OUT',
    }
}

// (이전상태, 액션) => 다음 상태를 만들어내는 함수
const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case HYDRATE:
            console.log('HYDRATE', action);
            return { ...state, ...action.payload };
        case 'LOG_IN':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: true,
                    user: action.data,
            },
        };
        case 'LOG_OUT':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: false,
                    user: null,
            },
        };
        default:
            return state;
    }
};

export default rootReducer;