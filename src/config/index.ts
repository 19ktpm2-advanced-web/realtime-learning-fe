/* eslint-disable */
export const config = {
    apiConfig: {
        methods: {
            get: 'GET',
            post: 'POST',
        },
        DOMAIN_NAME: process.env.REACT_APP_API_BASE_URL,
        ENDPOINT: {
            register: '/auth/register',
            login: '/auth/login',
            profile: '/user/profile',
            refreshToken: '/auth/refresh-token',
            loginByGoogle: '/auth/login-by-google',
        },
        refreshTokenMaxAge: 10000,
    },
    socket: {
        SERVER_URL: process.env.REACT_APP_SERVER_SOCKET_URL,
    },
    BASE_URL: process.env.REACT_APP_BASE_URL,
}
