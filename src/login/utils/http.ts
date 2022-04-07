import axios from 'axios'
import LoginStore from '../store'
import { Message } from 'element-ui'
import { error } from '@/constants/error'

const http = axios.create({
  withCredentials: true,
})

http.interceptors.request.use(
  (req) => {
    const token = LoginStore.token
    if (token) {
      if (!req.headers) req.headers = {}
      req.headers.Authorization = `Token ${token}`
    }
    return req
  },
  (err) => {
    return Promise.reject(err)
  },
)

http.interceptors.response.use(
  (res) => {
    return Promise.resolve(res)
  },
  (err) => {
    const response = err?.response
    const { message: msg, error: errorCode } = response?.data || {}
    if (msg) {
      Message({
        message: error[errorCode] || msg,
        type: 'error',
        showClose: true,
      })
    }
    return response || err
  },
)

export default http
