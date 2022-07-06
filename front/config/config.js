// eslint-disable-next-line import/prefer-default-export
export const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.taewitter.com'
    : 'http://localhost:3065';
// const CLIENT_ID = process.env.KAKAO_ID;

// const KAKAO_URI = process.env.NODE_ENV === 'production' ? 'https://api.taewitter.com/auth/kakao/callback' : 'http://localhost:3065/auth/kakao/callback';

// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${KAKAO_URI}&response_type=code`;
