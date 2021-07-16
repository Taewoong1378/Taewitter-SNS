// next와 관련된 파일을 반드시 pages 폴더 안에 들어있어야만 한다. Next가 pages 폴더를 인식해서 pages 폴더 안에 있는 파일들을 개별 페이지 컴포넌트로 만들어준다.
// import React from 'react';
// import해줄 필요는 없음. 불안하면 습관적으로 해도되긴함

const Home = () => {
    return (
        <div>Hello, next!</div>
    );
}

export default Home;