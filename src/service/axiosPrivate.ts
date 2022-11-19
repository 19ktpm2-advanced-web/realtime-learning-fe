/* eslint-disable */
import axios from 'axios'
import { config as baseConfig } from '../config'
import { memorizedRefreshToken } from './refreshToken'

const instance = axios.create({
    baseURL: baseConfig.apiConfig.DOMAIN_NAME,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    async (config) => {
        const session = JSON.parse(localStorage.getItem('session') || '')

        if (session?.accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${session?.accessToken}`,
            }
        }
        console.log(config)

        return config
    },
    (error) => Promise.reject(error),
)

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config

        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true

            const result = await memorizedRefreshToken()

            if (result?.accessToken) {
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${result?.accessToken}`,
                }
            }

            return axios(config)
        }
        return Promise.reject(error)
    },
)

export default instance
