export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpData: {},
    loginData: {},    
}

const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';

// 동적으로 액션을 생성하는 action creator
export const loginAction = (data) => {
    return {
        type: LOG_IN,
        data,
    }
}

export const logoutAction = () => {
    return {
        type: LOG_OUT,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state.user,
                isLoggedIn: true,
                me: action.data,
            };
        case LOG_OUT:
            return {
                ...state.user,
                isLoggedIn: false,
                 me: null,
            };
        default:
            return state;
    }
};

export default reducer;