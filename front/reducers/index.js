const initialState = {
    name: 'taewoong',
    age: 27,
    password: 'babo',
}

// async action creator  

// 동적으로 액션을 생성하는 action creator
const changeNickname = (data) => {
    return {
        type: 'CHANGE_NICKNAME',
        data,
    }
};

// const changeNickname = {
//     type: 'CHANGE_NICKNAME',
//     data: 'boogicho',
// }
changeNickname('boogicho');

// const changeNickname = {
//     type: 'CHANGE_NICKNAME',
//     data: '강태웅',
// }
changeNickname('강태웅');

// const changeNickname = {
//     type: 'CHANGE_NICKNAME',
//     data: '강뽀실',
// }


// (이전상태, 액션) => 다음 상태를 만들어내는 함수
const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CHANGE_NICKNAME' :
            return {
                ...state,
                name: action.data,
            }
    }
};

export default rootReducer;