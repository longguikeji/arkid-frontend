import axios, { Method } from 'axios'
import LoginStore from '../store/login'

const request = axios.create({
  withCredentials: true,
  validateStatus: (status) => {
    return /^(2|3)\d{2}$/.test(String(status))
  }
})

request.interceptors.request.use(
  (config) => {
    const token = LoginStore.token
    token && (config.headers.Authorization = `Token ${token}`)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default request
