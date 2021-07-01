import axios from 'axios'
import LoginStore from '../store/login'

const request = axios.create({
  baseURL: LoginStore.host,
  withCredentials: true,
  validateStatus: (status) => {
    return /^(2|3)\d{2}$/.test(String(status))
  }
})

request.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default request
