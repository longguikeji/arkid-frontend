import axios from 'axios'
import LoginStore from '../store/login'

const http = axios.create({
  withCredentials: true
})

http.interceptors.request.use(
  (config) => {
    const token = LoginStore.token
    token && (config.headers.Authorization = `Token ${token}`)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return err.response
  }
)

export default http
