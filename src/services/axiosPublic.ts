import axios from 'axios'
import constants from '../constants'

const axiosPublic = axios.create({
    baseURL: `${constants.apiConfig.DOMAIN_NAME}`,
    headers: {
        'Content-Type': 'application/json',
    },
})
export default axiosPublic
