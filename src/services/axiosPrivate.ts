import axios from 'axios'
import memorizedRefreshToken from './refreshToken'
import constants from '../constants'

axios.defaults.baseURL = constants.apiConfig.DOMAIN_NAME
axios.interceptors.request.use(
    async (config) => {
        let configObj = config
        const sessionStorage = JSON.parse(localStorage?.getItem('session') ?? '')
        if (sessionStorage?.accessToken) {
            configObj = {
                ...configObj,
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`,
                },
            }
        }
        return configObj
    },
    (error) => {
        return Promise.reject(error)
    },
)
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config
        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true
            const result = await memorizedRefreshToken()
            if (result?.accessToken) {
                config.headers.Authorization = `Bearer ${result?.accessToken}`
            }
            return axios(config)
        }
        return Promise.reject(error)
    },
)
const axiosPrivate = axios
export default axiosPrivate
