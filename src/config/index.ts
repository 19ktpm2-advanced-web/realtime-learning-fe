/* eslint-disable */
export const config = {
    apiConfig: {
        methods: {
            get: 'GET',
            post: 'POST',
        },
        DOMAIN_NAME: process.env.REACT_APP_BASE_URL,
        ENDPOINT: {
            register: '/auth/register',
            login: '/auth/login',
            profile: '/user/profile',
            refreshToken: '/auth/refresh-token',
            registerByGoogle: '/auth/register-by-google',
        },
        refreshTokenMaxAge: 10000,
    },
}
