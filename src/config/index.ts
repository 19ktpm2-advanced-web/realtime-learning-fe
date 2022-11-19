/* eslint-disable */
export const config = {
    apiConfig: {
        methods: {
            get: 'GET',
            post: 'POST',
        },
        DOMAIN_NAME: 'http://localhost:3300',
        // DOMAIN_NAME: 'http://localhost:4001',
        ENDPOINT: {
            register: '/auth/register',
            login: '/auth/login',
            profile: '/user/profile',
            refreshToken: '/auth/refresh-token',
        },
        refreshTokenMaxAge: 10000,
    },
}
