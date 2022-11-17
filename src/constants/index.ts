const constants = {
    apiConfig: {
        methods: {
            get: 'GET',
            post: 'POST',
        },
        DOMAIN_NAME: 'https://authentication-alpha.vercel.app',
        // DOMAIN_NAME: 'http://localhost:4001',
        ENDPOINT: {
            register: '/users/register',
            login: '/users/login',
            profile: '/users/profile',
            refreshToken: '/users/refresh-token',
        },
        refreshTokenMaxAge: 10000,
    },
}
export default constants
