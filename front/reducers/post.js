export const initialState = {
    // 서버 개발자와 Redux 구조에 대해서 합의를 보기
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '강태웅',
        },
        content: '첫 번째 게시글 #해시태그 #익스프레스',
        Images: [{
            src: 'https://img.kr.news.samsung.com/kr/wp-content/uploads/2017/07/170621_%EC%84%B8%EC%83%81%EC%9D%84%EC%9E%87IT%EB%8A%94%EC%9D%B4%EC%95%BC%EA%B8%B0_%EC%BD%94%EB%94%A9%EC%9D%98%EB%B3%B8%EC%A7%88%EA%B3%BC%EB%AF%B8%EB%9E%98%EC%9D%B4%EB%AF%B8%EC%A7%8009.jpg'
        }, {
            src: 'https://post-phinf.pstatic.net/MjAxODA1MjNfMjIg/MDAxNTI3MDU0MTI0Njk5.0leniJIhs4x6kX4gGubY_fQKoxgDR9w2ELHeNRqrXaYg.Y_e-WkJU10_Qe77AJiWb6-fiqSnt5UjwFz14jVU94Xcg.JPEG/shutterstock_571668544.jpg?type=w1200'
        }, {
            src: 'https://blog.kakaocdn.net/dn/zABhJ/btqBkOx3WrZ/urlKoNnI1ErlmT6bkZKLtk/img.jpg'
        }],
        Comments: [{
            User: {
                nickname: 'ktw2378',
            },
            content: '코딩 재밌겠다',
        }]
    }],
    // mainPosts 외에 다른 속성들
    // imagePaths: 이미지 업로드 할 때 이미지 경로
    // postAdded는 게시글 추가가 완료됐을 때 true가 될 것이다.
    imagePaths: [],
    postAdded: false,
}

const Add_POST = 'ADD_POST';

export const addPost = {
    type: Add_POST,
}
const dummyPost = {
    id: 2,
    content: '더미데이터입니다',
    User: {
        id: 1,
        nickname: 'ktw2378',
    },
    Images: [],
    Comments: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Add_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            };
        default:
            return state;
    }
};

export default reducer;