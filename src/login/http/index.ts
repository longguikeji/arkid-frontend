import axios from 'axios'
import LoginStore from '../store/login'
import { Message } from 'element-ui'
import { error } from '@/constants/error'

const toLogin = () => {
  LoginStore.removeToken()
  const { origin, search } = window.location
  window.location.replace(`${origin}/login${search}`)
}

const errorCallback = (status: number) => {
  switch (status) {
    case 401:
      toLogin()
      break
    case 403:
      toLogin()
      break
  }
}

const http = axios.create({
  withCredentials: true
})

http.interceptors.request.use(
  req => {
    const token = LoginStore.token
    if (token) {
      if (!req.headers) req.headers = {}
      req.headers.Authorization = `Token ${token}`
    }
    return req
  },
  err => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  res => {
    return Promise.resolve(res)
  },
  err => {
    const { response } = err
    const data = response && response.data
    if (data) {
      Message({
        message: error[data.error] || data.message || 'error',
        type: 'error',
        showClose: true
      })
    }
    if (response) {
      errorCallback(response.status)
      return response
    } else {
      return Promise.reject(err)
    }
  }
)

export default http